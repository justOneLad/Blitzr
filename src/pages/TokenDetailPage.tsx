import { useMemo, useState } from 'react'
import { useAppContext } from '../AppContext'
import { playBlitz } from '../audio'
import { areaPath, fmtUsd, seeded, sparkPath } from '../data'
import type { ChatMessage, CtoInfo, Token, TokenTab } from '../types'

const DEFAULT_CHAT: ChatMessage[] = [
  { who: '0x8f2a…91c4', msg: 'chart looking clean, liquidity locked forever is the play', mine: false },
  { who: '0xArkAngel', msg: "devs based for going 100% one-sided from block 1", mine: false },
]

export interface TokenDetailExtra {
  burnEnabled: boolean
  onToggleBurn: () => void
  pendingFeesEth: number
  onClaimFees: () => void
  ctoInfo: CtoInfo | null
  onSubmitCto: (form: CtoInfo) => void
  chatMessages: ChatMessage[]
  onSendChat: (msg: string) => void
}

export default function TokenDetailPage({ token, extra }: { token: Token; extra: TokenDetailExtra }) {
  const { c, spark, isMobile, isDark } = useAppContext()
  const [tab, setTab] = useState<TokenTab>('activity')
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy')
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeToast, setTradeToast] = useState('')
  const [slippage, setSlippage] = useState(1.0)
  const [slippageCustom, setSlippageCustom] = useState('')
  const [slippageIsCustom, setSlippageIsCustom] = useState(false)
  const [claimToast, setClaimToast] = useState('')
  const [chatDraft, setChatDraft] = useState('')
  const [ctoFormOpen, setCtoFormOpen] = useState(false)
  const [ctoForm, setCtoForm] = useState<CtoInfo>({ description: '', website: '', twitter: '', telegram: '' })
  const [ctoToast, setCtoToast] = useState('')

  const selId = token.id
  const description = extra.ctoInfo?.description || token.description
  const website = extra.ctoInfo?.website || token.website
  const twitter = extra.ctoInfo?.twitter || token.twitter
  const telegram = extra.ctoInfo?.telegram || token.telegram

  const bigLine = useMemo(() => sparkPath(token.points, 600, 220, 10), [token.points])
  const chartArea = useMemo(() => areaPath(bigLine, 600, 220, 10), [bigLine])
  const contract = '0x' + selId.padEnd(4, '0').slice(0, 4) + '…c9F2'
  const volStr = fmtUsd(token.mcap * 0.18)

  const activity = useMemo(() => {
    const types: { type: 'BUY' | 'SELL'; color: string }[] = [
      { type: 'BUY', color: c.success },
      { type: 'SELL', color: c.danger },
      { type: 'BUY', color: c.success },
      { type: 'BUY', color: c.success },
      { type: 'SELL', color: c.danger },
    ]
    return types.map((a, i) => ({
      ...a,
      addr: '0x' + ((selId.charCodeAt(0) * 13 + i * 7) % 9999).toString(16).padStart(4, '0') + '…' + ((i * 31) % 9999).toString(16).padStart(4, '0'),
      amount: (0.05 + i * 0.31).toFixed(3) + ' ETH',
      time: (i + 1) * 3 + 'm ago',
    }))
  }, [selId, c.success, c.danger])

  const holders = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const rnd2 = seeded(selId.length * 211 + i * 17 + 3)
      const pct = i === 0 ? 8.4 + rnd2() * 3 : i < 3 ? 2 + rnd2() * 3 : 0.3 + rnd2() * 1.8
      return {
        rank: i + 1,
        addr: i === 0 ? '0x0000…dEaD (LP lock)' : '0x' + Array.from({ length: 4 }, () => Math.floor(rnd2() * 16).toString(16)).join('') + '…' + Array.from({ length: 4 }, () => Math.floor(rnd2() * 16).toString(16)).join(''),
        pctStr: pct.toFixed(2) + '%',
        valueStr: fmtUsd(token.mcap * (pct / 100)),
      }
    })
  }, [selId, token.mcap])

  const chatMessages = extra.chatMessages.length ? extra.chatMessages : DEFAULT_CHAT

  const feeSplitLabel = extra.burnEnabled ? '🔥 Burned on claim' : '70% creator / 30% platform'
  const pendingFeesStr = extra.pendingFeesEth.toFixed(3) + ' ETH'
  const isCTO = !!extra.ctoInfo
  const showCreatorTools = !token.isCurated
  const eligible = !token.isCurated && !isCTO && (token.antiBotBlocksLeft ?? 0) === 0

  const ownedBalance = 500 + selId.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0) % 12000
  const ownedEth = 3.284
  const isSell = tradeMode === 'sell'
  const amt = parseFloat(tradeAmount) || 0
  const estOut =
    tradeMode === 'buy'
      ? (amt / token.basePrice).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ' + token.ticker
      : (amt * token.basePrice).toFixed(4) + ' ETH'
  const slip = slippageIsCustom ? parseFloat(slippageCustom) || 0 : slippage
  const buyQuicks = ['0.1', '0.5', '1', 'Max']
  const sellQuicks = ['25%', '50%', '75%', 'Max']

  const tokenGridCols = isMobile ? '1fr' : '2fr 1fr'
  const statsCols = 'repeat(auto-fit, minmax(130px,1fr))'
  const pagePad = isMobile ? '28px 16px 60px' : '44px 28px 80px'

  const submitTrade = () => {
    if (!amt) return
    playBlitz()
    setTradeToast((tradeMode === 'buy' ? 'Bought ' : 'Sold ') + estOut)
    setTradeAmount('')
    setTimeout(() => setTradeToast(''), 2200)
  }

  const claimFees = () => {
    if (extra.pendingFeesEth <= 0) return
    extra.onClaimFees()
    setClaimToast('Claimed ' + extra.pendingFeesEth.toFixed(3) + ' ETH to feeWallet')
    setTimeout(() => setClaimToast(''), 2400)
  }

  const openCtoForm = () => {
    playBlitz()
    setCtoFormOpen(true)
    setCtoForm({ description, website: website || '', twitter: twitter || '', telegram: telegram || '' })
  }

  const submitCto = () => {
    playBlitz()
    extra.onSubmitCto(ctoForm)
    setCtoFormOpen(false)
    setCtoToast('0.02 ETH takeover fee paid (non-refundable) — metadata updated')
    setTimeout(() => setCtoToast(''), 2600)
  }

  const sendChat = () => {
    const draft = chatDraft.trim()
    if (!draft) return
    extra.onSendChat(draft)
    setChatDraft('')
  }

  return (
    <div data-screen-label="Token detail" style={{ maxWidth: 1240, margin: '0 auto', padding: pagePad }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div
          style={{
            width: 64,
            height: 64,
            flex: 'none',
            background: token.hue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 22,
            color: '#08080b',
          }}
        >
          {token.initial}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{token.name}</h1>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: c.textMuted, fontWeight: 600 }}>{token.ticker}</span>
            {token.isNew && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#08080b', background: c.accent, padding: '3px 8px', letterSpacing: '.04em', animation: 'boltPulse 1.6s infinite' }}>NEW</span>
            )}
            {isCTO && (
              <span style={{ fontSize: 11, fontWeight: 700, color: c.accent2, border: `1px solid ${c.accent2}66`, padding: '3px 8px', letterSpacing: '.02em' }}>🤝 CTO'd</span>
            )}
            <span style={{ fontSize: 11, fontWeight: 700, color: token.stackColor, border: `1px solid ${token.stackColor}66`, padding: '3px 8px', letterSpacing: '.02em' }}>{token.stackLabel}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, border: `1px solid ${c.border}`, padding: '3px 8px' }}>Quote: {token.quote}</span>
            {token.antiBotActive && (
              <span style={{ fontSize: 11, fontWeight: 700, color: c.danger, border: `1px solid ${c.danger}66`, padding: '3px 8px' }}>⚡ Anti-bot: {token.antiBotBlocksLeft} blocks left</span>
            )}
            {token.isCurated && (
              <span style={{ fontSize: 11, fontWeight: 600, color: c.textFaint, border: `1px solid ${c.border}`, padding: '3px 8px' }}>Not launched on Blitzr — curated for trading</span>
            )}
          </div>
          <div style={{ color: c.textMuted, fontSize: 13.5, marginTop: 4, fontFamily: "'JetBrains Mono',monospace" }}>{contract}</div>
          <div style={{ fontSize: 14, color: c.textMuted, marginTop: 10, maxWidth: 520, lineHeight: 1.5 }}>{description}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10 }}>
            {website && <a href="#" style={{ fontSize: 13, fontWeight: 600, color: c.accent }}>🌐 {website}</a>}
            {twitter && <a href="#" style={{ fontSize: 13, fontWeight: 600, color: c.accent }}>𝕏 {twitter}</a>}
            {telegram && <a href="#" style={{ fontSize: 13, fontWeight: 600, color: c.accent }}>✈ {telegram}</a>}
          </div>
        </div>
        <div style={{ textAlign: 'right', flex: 'none' }}>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{token.priceStr}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: token.changeColor }}>{token.changeStr} · 24h</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: tokenGridCols, gap: 20, alignItems: 'start' }}>
        <div>
          <div style={{ background: c.panel, border: `1px solid ${c.border}`, padding: 24, clipPath: 'polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)' }}>
            <svg viewBox="0 0 600 220" width="100%" height="220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.accent} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chartArea} fill="url(#chartFill)" />
              <path d={bigLine} fill="none" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${c.accent}88)` }} />
            </svg>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: statsCols, gap: 1, background: c.border, border: `1px solid ${c.border}`, marginTop: 16 }}>
            <div style={{ background: c.bg, padding: 18 }}>
              <div style={{ fontSize: 12, color: c.textFaint, fontWeight: 700, letterSpacing: '.04em' }}>MARKET CAP</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 700, marginTop: 6 }}>{token.mcapStr}</div>
            </div>
            <div style={{ background: c.bg, padding: 18 }}>
              <div style={{ fontSize: 12, color: c.textFaint, fontWeight: 700, letterSpacing: '.04em' }}>HOLDERS</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 700, marginTop: 6 }}>{token.holdersStr}</div>
            </div>
            <div style={{ background: c.bg, padding: 18 }}>
              <div style={{ fontSize: 12, color: c.textFaint, fontWeight: 700, letterSpacing: '.04em' }}>24H VOLUME</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 700, marginTop: 6 }}>{volStr}</div>
            </div>
          </div>

          {showCreatorTools && (
            <div style={{ marginTop: 16, background: c.panel, border: `1px solid ${c.border}`, padding: 20, clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, letterSpacing: '.08em', marginBottom: 14 }}>CREATOR TOOLS</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Fee split — launched-token leg</div>
                  <div style={{ fontSize: 12.5, color: c.textMuted, marginTop: 2 }}>{feeSplitLabel}</div>
                </div>
                <div onClick={spark(extra.onToggleBurn)} className="clickable" style={{ width: 44, height: 24, borderRadius: 999, background: c.panelAlt, border: `1px solid ${c.border}`, position: 'relative', flex: 'none' }}>
                  <div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: c.accent, transition: 'transform .15s', transform: extra.burnEnabled ? 'translateX(20px)' : 'translateX(0)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Pending creator fees</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, marginTop: 2, color: c.accent }}>{pendingFeesStr}</div>
                </div>
                <div onClick={spark(claimFees)} className="clickable" style={{ padding: '10px 18px', fontWeight: 700, fontSize: 13.5, background: c.accent, color: '#08080b', clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}>
                  Claim fees
                </div>
              </div>
              {!!claimToast && <div style={{ marginTop: 12, fontSize: 12.5, color: c.accent, fontWeight: 600 }}>{claimToast}</div>}
            </div>
          )}

          {eligible && (
            <div style={{ marginTop: 16, background: c.panel, border: `1px solid ${c.accent2}55`, padding: 20, clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.accent2, letterSpacing: '.08em', marginBottom: 8 }}>COMMUNITY TAKEOVER</div>
              <div style={{ fontSize: 13.5, color: c.textMuted, lineHeight: 1.5, marginBottom: 14 }}>
                Liquidity is permanent regardless of who runs the page — a CTO only updates the public description and socials shown here, community-run. Anyone can propose one.
              </div>
              {ctoFormOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: c.panelAlt, border: `1px solid ${c.danger}55` }}>
                    <span style={{ flex: 'none', fontWeight: 800, color: c.danger }}>⚡</span>
                    <div style={{ fontSize: 13, color: c.text, lineHeight: 1.5 }}>
                      Submitting costs a <b>0.02 ETH</b> fee, charged whether or not the community accepts it. This is <b>non-refundable</b> — it exists to keep bots from spamming fake takeovers.
                    </div>
                  </div>
                  <textarea
                    value={ctoForm.description}
                    onChange={(e) => setCtoForm({ ...ctoForm, description: e.target.value })}
                    placeholder="New description"
                    rows={2}
                    style={{ width: '100%', background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: 11, fontSize: 13.5, resize: 'vertical' }}
                  />
                  <input
                    value={ctoForm.website}
                    onChange={(e) => setCtoForm({ ...ctoForm, website: e.target.value })}
                    placeholder="Website"
                    style={{ width: '100%', background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: 11, fontSize: 13.5 }}
                  />
                  <input
                    value={ctoForm.twitter}
                    onChange={(e) => setCtoForm({ ...ctoForm, twitter: e.target.value })}
                    placeholder="X / Twitter handle"
                    style={{ width: '100%', background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: 11, fontSize: 13.5 }}
                  />
                  <input
                    value={ctoForm.telegram}
                    onChange={(e) => setCtoForm({ ...ctoForm, telegram: e.target.value })}
                    placeholder="Telegram"
                    style={{ width: '100%', background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: 11, fontSize: 13.5 }}
                  />
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <div onClick={spark(() => setCtoFormOpen(false))} className="clickable" style={{ padding: '11px 18px', fontWeight: 700, fontSize: 13, color: c.textMuted, border: `1px solid ${c.border}` }}>
                      Cancel
                    </div>
                    <div onClick={spark(submitCto)} className="clickable" style={{ padding: '11px 20px', fontWeight: 700, fontSize: 13, background: c.accent2, color: '#fff' }}>
                      Pay 0.02 ETH &amp; submit
                    </div>
                  </div>
                </div>
              )}
              {!ctoFormOpen && (
                <div onClick={spark(openCtoForm)} className="clickable" style={{ padding: '11px 20px', fontWeight: 700, fontSize: 13, background: 'transparent', color: c.accent2, border: `1px solid ${c.accent2}66`, width: 'fit-content' }}>
                  Propose a takeover (0.02 ETH, non-refundable)
                </div>
              )}
              {!!ctoToast && <div style={{ marginTop: 12, fontSize: 12.5, color: c.accent2, fontWeight: 600 }}>{ctoToast}</div>}
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${c.border}`, marginBottom: 0 }}>
              {(['activity', 'holders', 'chat'] as TokenTab[]).map((t) => (
                <div
                  key={t}
                  onClick={spark(() => setTab(t))}
                  className="clickable"
                  style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, color: tab === t ? c.text : c.textFaint, borderBottom: `2px solid ${tab === t ? c.accent : 'transparent'}` }}
                >
                  {t === 'activity' ? 'Activity' : t === 'holders' ? 'Holders' : 'Chat'}
                </div>
              ))}
            </div>

            {tab === 'activity' && (
              <div style={{ border: `1px solid ${c.border}`, borderTop: 'none' }}>
                {activity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${c.border}`, fontSize: 13.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: a.color }}>{a.type}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: c.textMuted }}>{a.addr}</span>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>{a.amount}</div>
                    <div style={{ color: c.textFaint }}>{a.time}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'holders' && (
              <div style={{ border: `1px solid ${c.border}`, borderTop: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr', padding: '10px 16px', fontSize: 11.5, fontWeight: 700, color: c.textFaint, borderBottom: `1px solid ${c.border}` }}>
                  <div>#</div>
                  <div>ADDRESS</div>
                  <div>% SUPPLY</div>
                  <div>VALUE</div>
                </div>
                {holders.map((h) => (
                  <div key={h.rank} style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr', padding: '12px 16px', fontSize: 13.5, borderBottom: `1px solid ${c.border}`, alignItems: 'center' }}>
                    <div style={{ color: c.textFaint, fontWeight: 700 }}>{h.rank}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", color: c.text }}>{h.addr}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace" }}>{h.pctStr}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", color: c.textMuted }}>{h.valueStr}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'chat' && (
              <div style={{ border: `1px solid ${c.border}`, borderTop: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, maxHeight: 280, overflowY: 'auto' }}>
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.mine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      <div style={{ fontSize: 11.5, color: c.textFaint, marginBottom: 3, fontFamily: "'JetBrains Mono',monospace" }}>{m.who}</div>
                      <div style={{ padding: '10px 14px', fontSize: 13.5, background: c.panelAlt, lineHeight: 1.4 }}>{m.msg}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, padding: 14, borderTop: `1px solid ${c.border}` }}>
                  <input
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    placeholder="Say something…"
                    style={{ flex: 1, background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: '10px 14px', fontSize: 14 }}
                  />
                  <div onClick={spark(sendChat)} className="clickable" style={{ padding: '10px 20px', fontWeight: 700, fontSize: 13.5, background: c.accent, color: '#08080b' }}>
                    Send
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: c.panel, border: `1px solid ${c.border}`, padding: 22, position: isMobile ? 'static' : 'sticky', top: 88, clipPath: 'polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)' }}>
          <div style={{ display: 'flex', background: c.panelAlt, padding: 4, marginBottom: 18 }}>
            <div
              onClick={spark(() => setTradeMode('buy'))}
              className="clickable"
              style={{ flex: 1, textAlign: 'center', padding: 10, fontWeight: 700, fontSize: 14, color: tradeMode === 'buy' ? '#08080b' : c.textMuted, background: tradeMode === 'buy' ? c.accent : 'transparent' }}
            >
              Buy
            </div>
            <div
              onClick={spark(() => setTradeMode('sell'))}
              className="clickable"
              style={{ flex: 1, textAlign: 'center', padding: 10, fontWeight: 700, fontSize: 14, color: tradeMode === 'sell' ? '#08080b' : c.textMuted, background: tradeMode === 'sell' ? c.danger : 'transparent' }}
            >
              Sell
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, color: c.textMuted, fontWeight: 600 }}>Amount ({isSell ? token.ticker : 'ETH'})</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.textFaint }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                <path d="M17 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v3" />
                <path d="M17 13h2" />
              </svg>
              {isSell ? ownedBalance.toLocaleString() + ' ' + token.ticker : ownedEth + ' ETH'}
            </span>
          </div>
          <input
            value={tradeAmount}
            onChange={(e) => setTradeAmount(e.target.value)}
            placeholder="0.0"
            style={{ width: '100%', background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: 14, fontSize: 18, fontFamily: "'JetBrains Mono',monospace", marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, minWidth: 0 }}>
            {(isSell ? sellQuicks : buyQuicks).map((label) => (
              <div
                key={label}
                onClick={spark(() => {
                  if (isSell) {
                    const pct = label === 'Max' ? 1 : parseFloat(label) / 100
                    setTradeAmount((ownedBalance * pct).toFixed(4).replace(/\.?0+$/, ''))
                  } else {
                    setTradeAmount(label === 'Max' ? ownedEth.toString() : label)
                  }
                })}
                className="clickable"
                style={{ flex: 1, minWidth: 0, textAlign: 'center', padding: '7px 4px', fontSize: 12, fontWeight: 600, border: `1px solid ${c.border}`, color: c.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {label}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: c.textMuted, marginBottom: 6 }}>
            <span>You receive</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: c.text }}>{estOut}</span>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: c.textMuted, marginBottom: 8 }}>
              <span>Slippage tolerance</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: c.text }}>{slip}%</span>
            </div>
            <div style={{ display: 'flex', gap: 6, minWidth: 0 }}>
              {[0.5, 1, 3].map((v) => {
                const active = !slippageIsCustom && slippage === v
                return (
                  <div
                    key={v}
                    onClick={spark(() => {
                      setSlippage(v)
                      setSlippageIsCustom(false)
                    })}
                    className="clickable"
                    style={{ flex: 1, minWidth: 0, textAlign: 'center', padding: '7px 4px', fontSize: 12, fontWeight: 600, border: `1px solid ${c.border}`, color: active ? '#08080b' : c.textMuted, background: active ? c.accent : 'transparent' }}
                  >
                    {v}%
                  </div>
                )
              })}
              <input
                value={slippageCustom}
                onChange={(e) => {
                  setSlippageCustom(e.target.value)
                  setSlippageIsCustom(true)
                }}
                placeholder="Custom"
                style={{ flex: 1, minWidth: 0, background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: '7px 4px', fontSize: 12, textAlign: 'center' }}
              />
            </div>
            {slip > 5 && <div style={{ fontSize: 12, color: c.danger, marginTop: 6 }}>⚡ High slippage — you may get a worse price than expected.</div>}
          </div>
          <div
            onClick={spark(submitTrade)}
            className="clickable"
            style={{ textAlign: 'center', padding: 15, fontWeight: 700, fontSize: 15, background: tradeMode === 'buy' ? c.accent : c.danger, color: tradeMode === 'buy' ? '#08080b' : '#fff', clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
          >
            {tradeMode === 'buy' ? 'Buy ' + token.ticker : 'Sell ' + token.ticker}
          </div>
          {!!tradeToast && <div style={{ marginTop: 12, fontSize: 12.5, textAlign: 'center', color: c.accent, fontWeight: 600 }}>{tradeToast}</div>}
        </div>
      </div>
    </div>
  )
}
