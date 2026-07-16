import { useAppContext } from '../AppContext'
import type { LaunchForm } from '../types'

const STEP_LABELS = ['Details', 'Liquidity & Fees', 'Review', 'Deploy']

export interface LaunchPageProps {
  step: number
  form: LaunchForm
  agree: boolean
  deploying: boolean
  deployed: boolean
  deployAddress: string
  onFormChange: (patch: Partial<LaunchForm>) => void
  onSetAgree: (v: boolean) => void
  onNext: () => void
  onBack: () => void
  onDeploy: () => void
  onViewToken: () => void
  onReset: () => void
}

export default function LaunchPage({
  step,
  form,
  agree,
  deploying,
  deployed,
  deployAddress,
  onFormChange,
  onSetAgree,
  onNext,
  onBack,
  onDeploy,
  onViewToken,
  onReset,
}: LaunchPageProps) {
  const { c, spark, isMobile } = useAppContext()

  const canNextDetails = form.name.trim() && form.ticker.trim()
  const instantBuyVal = parseFloat(form.instantBuyEth) || 0
  const instantBuyWarn = instantBuyVal > 0 && instantBuyVal >= 2.5
  const nextEnabled = step === 0 ? !!canNextDetails : step === 1 ? !instantBuyWarn : step === 2 ? agree : true

  const steps = STEP_LABELS.map((label, i) => ({
    label,
    icon: i < step ? '✓' : (i + 1).toString(),
    circleBg: i <= step ? c.accent : 'transparent',
    circleColor: i <= step ? '#08080b' : c.textMuted,
    circleBorder: i <= step ? c.accent : c.borderStrong,
    labelColor: i === step ? c.text : c.textFaint,
    hasLine: i < STEP_LABELS.length - 1,
    lineColor: i < step ? c.accent : c.border,
    flex: i < STEP_LABELS.length - 1 ? 1 : ('none' as const),
  }))

  const reviewRows = [
    { label: 'Name', value: form.name || '—' },
    { label: 'Ticker', value: form.ticker || '—' },
    { label: 'Stack', value: form.stack === 'v4' ? 'xBlitzr (Uniswap V4)' : 'Blitzr (Uniswap V3)' },
    { label: 'Quote token', value: form.quoteToken },
    { label: 'Total supply', value: '1,000,000,000 (100% to liquidity)' },
    { label: 'Launch fee', value: '0.05 ETH' },
    { label: 'Instant buy', value: instantBuyVal > 0 ? instantBuyVal + ' ETH' : 'None' },
    { label: 'Fee wallet', value: form.feeWallet.trim() || 'Your connected wallet' },
    { label: 'Fee burn (launched leg)', value: form.burnEnabled ? 'Enabled' : 'Disabled' },
  ]

  const launchRowDir = isMobile ? 'column' : 'row'
  const launchMaxW = isMobile ? '100%' : 840
  const backOrder = isMobile ? 2 : 0
  const launchBtnWidth = isMobile ? '100%' : 'auto'
  const ctaAlign = isMobile ? 'stretch' : 'center'
  const nextBg = nextEnabled ? c.accent : c.panelAlt
  const nextColor = nextEnabled ? '#08080b' : c.textFaint
  const pagePad = isMobile ? '28px 16px 60px' : '44px 28px 80px'

  return (
    <div data-screen-label="Launch" style={{ maxWidth: launchMaxW, margin: '0 auto', padding: pagePad }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-.02em' }}>Launch a token</h1>
      <p style={{ color: c.textMuted, fontSize: 14.5, margin: '0 0 32px' }}>Deploy on-chain with permanent, one-sided liquidity.</p>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36, overflowX: 'auto' }}>
        {steps.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: st.flex, minWidth: 34 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 'none' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                  background: st.circleBg,
                  color: st.circleColor,
                  border: `1px solid ${st.circleBorder}`,
                  clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',
                }}
              >
                {st.icon}
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: st.labelColor, letterSpacing: '.03em', whiteSpace: 'nowrap', display: isMobile ? 'none' : 'block' }}>{st.label}</div>
            </div>
            {st.hasLine && <div style={{ flex: 1, height: 2, background: st.lineColor, margin: '0 8px 20px', minWidth: 16 }} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: launchRowDir, gap: 18 }}>
            <div style={{ flex: 'none', width: 88, height: 88, borderRadius: '50%', background: c.panelAlt, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: c.textFaint, fontWeight: 600, textAlign: 'center' }}>
              Logo
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>TOKEN NAME</div>
                <input
                  value={form.name}
                  onChange={(e) => onFormChange({ name: e.target.value })}
                  placeholder="e.g. Thunderhead"
                  style={{ width: '100%', background: c.panel, border: `1px solid ${c.border}`, color: c.text, padding: 13, fontSize: 15 }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>TICKER</div>
                <input
                  value={form.ticker}
                  onChange={(e) => onFormChange({ ticker: e.target.value.toUpperCase() })}
                  placeholder="e.g. THUNDR"
                  style={{ width: '100%', background: c.panel, border: `1px solid ${c.border}`, color: c.text, padding: 13, fontSize: 15, fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase' }}
                />
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>DESCRIPTION</div>
            <textarea
              value={form.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder="What is it. Why it exists. Keep it sharp."
              rows={3}
              style={{ width: '100%', background: c.panel, border: `1px solid ${c.border}`, color: c.text, padding: 13, fontSize: 14.5, resize: 'vertical' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>DEX STACK</div>
            <div style={{ display: 'flex', flexDirection: launchRowDir, gap: 10 }}>
              <div
                onClick={spark(() => onFormChange({ stack: 'v3' }))}
                className="clickable"
                style={{ flex: 1, padding: 14, background: form.stack === 'v3' ? c.accent : 'transparent', color: form.stack === 'v3' ? '#08080b' : c.textMuted, border: `1px solid ${c.border}` }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>Blitzr</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Uniswap V3 · any registered DEX</div>
              </div>
              <div
                onClick={spark(() => onFormChange({ stack: 'v4' }))}
                className="clickable"
                style={{ flex: 1, padding: 14, background: form.stack === 'v4' ? c.accent2 : 'transparent', color: form.stack === 'v4' ? '#fff' : c.textMuted, border: `1px solid ${c.border}` }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>xBlitzr</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Uniswap V4 · hook-enforced lock</div>
              </div>
            </div>
          </div>
          <div
            onClick={nextEnabled ? spark(onNext) : undefined}
            className={nextEnabled ? 'clickable' : ''}
            style={{
              alignSelf: ctaAlign,
              width: launchBtnWidth,
              textAlign: 'center',
              marginTop: 8,
              padding: '14px 28px',
              fontWeight: 700,
              fontSize: 14.5,
              background: nextBg,
              color: nextColor,
              clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)',
            }}
          >
            Continue →
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, background: c.accentSoft, border: `1px solid ${c.accent}55` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flex: 'none', marginTop: 2 }}>
              <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill={c.accent} />
            </svg>
            <div style={{ fontSize: 13.5, color: c.text, lineHeight: 1.5 }}>
              Fixed supply of <b>1,000,000,000</b> tokens — 100% seeded one-sided into the pool and <b>permanently locked</b>. There is no creator reserve.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>QUOTE TOKEN</div>
            <div style={{ display: 'flex', flexDirection: launchRowDir, gap: 10 }}>
              <div
                onClick={spark(() => onFormChange({ quoteToken: 'WETH' }))}
                className="clickable"
                style={{ flex: 1, textAlign: 'center', padding: 12, fontWeight: 700, fontSize: 14, background: form.quoteToken === 'WETH' ? c.accent : 'transparent', color: form.quoteToken === 'WETH' ? '#08080b' : c.textMuted, border: `1px solid ${c.border}` }}
              >
                WETH
              </div>
              <div
                onClick={spark(() => onFormChange({ quoteToken: 'USDC' }))}
                className="clickable"
                style={{ flex: 1, textAlign: 'center', padding: 12, fontWeight: 700, fontSize: 14, background: form.quoteToken === 'USDC' ? c.accent : 'transparent', color: form.quoteToken === 'USDC' ? '#08080b' : c.textMuted, border: `1px solid ${c.border}` }}
              >
                USDC
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: c.panel, border: `1px solid ${c.border}` }}>
            <span style={{ fontSize: 13.5, color: c.textMuted }}>Launch fee (native ETH, fixed)</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14 }}>0.05 ETH</span>
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>INSTANT BUY — OPTIONAL EXTRA ETH</div>
            <input
              value={form.instantBuyEth}
              onChange={(e) => onFormChange({ instantBuyEth: e.target.value })}
              placeholder="0.0"
              style={{ width: '100%', background: c.panel, border: `1px solid ${c.border}`, color: c.text, padding: 13, fontSize: 15, fontFamily: "'JetBrains Mono',monospace" }}
            />
            {instantBuyWarn && <div style={{ fontSize: 12.5, color: c.danger, marginTop: 6 }}>⚡ A buy this large will likely exceed the 2.5% anti-bot max-wallet cap and revert the launch.</div>}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, marginBottom: 6 }}>FEE WALLET — OPTIONAL</div>
            <input
              value={form.feeWallet}
              onChange={(e) => onFormChange({ feeWallet: e.target.value })}
              placeholder="Defaults to your connected wallet"
              style={{ width: '100%', background: c.panel, border: `1px solid ${c.border}`, color: c.text, padding: 13, fontSize: 14.5, fontFamily: "'JetBrains Mono',monospace" }}
            />
          </div>
          <div onClick={spark(() => onFormChange({ burnEnabled: !form.burnEnabled }))} className="clickable" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 4 }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${form.burnEnabled ? c.accent : c.borderStrong}`, background: form.burnEnabled ? c.accent : 'transparent', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#08080b', fontWeight: 800 }}>
              {form.burnEnabled ? '✓' : ''}
            </div>
            <div style={{ fontSize: 13.5, color: c.textMuted }}>Burn the launched-token fee leg on every claim (default on — deflationary).</div>
          </div>
          <div style={{ display: 'flex', flexDirection: launchRowDir, justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
            <div onClick={spark(onBack)} className="clickable" style={{ padding: '14px 24px', fontWeight: 700, fontSize: 14.5, color: c.textMuted, border: `1px solid ${c.border}`, textAlign: 'center', order: backOrder }}>
              ← Back
            </div>
            <div
              onClick={nextEnabled ? spark(onNext) : undefined}
              className={nextEnabled ? 'clickable' : ''}
              style={{ padding: '14px 28px', fontWeight: 700, fontSize: 14.5, background: nextBg, color: nextColor, clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)', textAlign: 'center' }}
            >
              Continue →
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ border: `1px solid ${c.border}` }}>
            {reviewRows.map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${c.border}`, fontSize: 14 }}>
                <span style={{ color: c.textMuted }}>{row.label}</span>
                <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div onClick={spark(() => onSetAgree(!agree))} className="clickable" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 4 }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${agree ? c.accent : c.borderStrong}`, background: agree ? c.accent : 'transparent', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#08080b', fontWeight: 800 }}>
              {agree ? '✓' : ''}
            </div>
            <div style={{ fontSize: 13.5, color: c.textMuted }}>I understand liquidity is permanent and cannot be withdrawn.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: launchRowDir, justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
            <div onClick={spark(onBack)} className="clickable" style={{ padding: '14px 24px', fontWeight: 700, fontSize: 14.5, color: c.textMuted, border: `1px solid ${c.border}`, textAlign: 'center', order: backOrder }}>
              ← Back
            </div>
            <div
              onClick={nextEnabled ? spark(onNext) : undefined}
              className={nextEnabled ? 'clickable' : ''}
              style={{ padding: '14px 28px', fontWeight: 700, fontSize: 14.5, background: nextBg, color: nextColor, clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)', textAlign: 'center' }}
            >
              Continue →
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '50px 20px', textAlign: 'center' }}>
          {!deploying && !deployed && (
            <>
              <svg width="64" height="64" viewBox="0 0 24 24">
                <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill={c.accent} style={{ filter: `drop-shadow(0 0 16px ${c.accent}aa)` }} />
              </svg>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Ready to deploy</div>
              <div style={{ color: c.textMuted, fontSize: 14, maxWidth: 380 }}>This simulates broadcasting the deploy transaction on-chain.</div>
              <div
                onClick={spark(onDeploy)}
                className="clickable"
                style={{ padding: '16px 36px', fontWeight: 700, fontSize: 15.5, background: c.accent, color: '#08080b', clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)', boxShadow: `0 0 30px ${c.accent}55` }}
              >
                Deploy token
              </div>
            </>
          )}

          {deploying && (
            <>
              <svg width="56" height="56" viewBox="0 0 24 24" style={{ animation: 'spin 1.1s linear infinite' }}>
                <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill="none" stroke={c.accent} strokeWidth="1.5" />
              </svg>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Broadcasting transaction…</div>
              <div style={{ width: '100%', maxWidth: 280, height: 8, background: c.panelAlt, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(45deg,${c.accent} 0 8px,transparent 8px 16px)`, animation: 'boltFlow .6s linear infinite' }} />
              </div>
            </>
          )}

          {deployed && (
            <>
              <div style={{ width: 64, height: 64, background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}>
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill="#08080b" />
                </svg>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{form.ticker} is live</div>
              <div style={{ color: c.textMuted, fontSize: 13.5, fontFamily: "'JetBrains Mono',monospace", wordBreak: 'break-all', maxWidth: 320 }}>{deployAddress}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 8 }}>
                <div onClick={spark(onViewToken)} className="clickable" style={{ padding: '14px 26px', fontWeight: 700, fontSize: 14.5, background: c.accent, color: '#08080b', clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}>
                  View token
                </div>
                <div onClick={spark(onReset)} className="clickable" style={{ padding: '14px 26px', fontWeight: 700, fontSize: 14.5, color: c.text, border: `1px solid ${c.border}` }}>
                  Launch another
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
