import { useAppContext } from '../AppContext'
import TokenCard from '../components/TokenCard'
import { fmtUsd } from '../data'
import type { Token } from '../types'

export interface Holding {
  token: Token
  amountStr: string
  valueStr: string
}

export default function PortfolioPage({
  connected,
  address,
  holdings,
  launched,
  onOpenToken,
  onConnect,
}: {
  connected: boolean
  address: string
  holdings: Holding[]
  launched: Token[]
  onOpenToken: (id: string) => void
  onConnect: () => void
}) {
  const { c, spark, isMobile } = useAppContext()
  const pagePad = isMobile ? '28px 16px 60px' : '44px 28px 80px'
  const totalVal = holdings.reduce((s, h) => s + h.token.basePrice * parseFloat(h.amountStr.replace(/,/g, '')), 0)

  return (
    <div data-screen-label="Portfolio" style={{ maxWidth: 1040, margin: '0 auto', padding: pagePad }}>
      {connected ? (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Your portfolio</h1>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: c.textMuted, fontSize: 13, marginTop: 6 }}>{address}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12.5, color: c.textMuted, fontWeight: 600 }}>TOTAL VALUE</div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{fmtUsd(totalVal)}</div>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, letterSpacing: '.08em', marginBottom: 12 }}>HOLDINGS</div>

          {isMobile ? (
            <div style={{ border: `1px solid ${c.border}`, marginBottom: 36 }}>
              {holdings.map((h) => (
                <div
                  key={h.token.id}
                  onClick={spark(() => onOpenToken(h.token.id))}
                  className="clickable"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${c.border}` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        flex: 'none',
                        background: h.token.hue,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 12,
                        color: '#08080b',
                        clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',
                      }}
                    >
                      {h.token.initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{h.token.ticker}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, color: c.textMuted }}>{h.amountStr} @ {h.token.priceStr}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14.5, fontWeight: 700, flex: 'none' }}>{h.valueStr}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ border: `1px solid ${c.border}`, marginBottom: 40, overflowX: 'auto' }}>
              <div style={{ minWidth: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 18px', fontSize: 12, fontWeight: 700, color: c.textFaint, borderBottom: `1px solid ${c.border}` }}>
                  <div>TOKEN</div>
                  <div>HOLDING</div>
                  <div>PRICE</div>
                  <div>VALUE</div>
                </div>
                {holdings.map((h) => (
                  <div
                    key={h.token.id}
                    onClick={spark(() => onOpenToken(h.token.id))}
                    className="clickable"
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 18px', alignItems: 'center', borderBottom: `1px solid ${c.border}` }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          background: h.token.hue,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 11,
                          color: '#08080b',
                          clipPath: 'polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px)',
                        }}
                      >
                        {h.token.initial}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{h.token.ticker}</span>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5 }}>{h.amountStr}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5 }}>{h.token.priceStr}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5, fontWeight: 700 }}>{h.valueStr}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, letterSpacing: '.08em', marginBottom: 12 }}>LAUNCHED BY YOU</div>
          {launched.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
              {launched.map((t) => (
                <TokenCard key={t.id} tok={t} onOpen={() => onOpenToken(t.id)} />
              ))}
            </div>
          ) : (
            <div style={{ padding: 32, border: `1px dashed ${c.border}`, textAlign: 'center', color: c.textMuted, fontSize: 14 }}>You haven't launched a token yet.</div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '60px 20px 40px', textAlign: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 24 24">
            <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill={c.accent} opacity="0.6" />
          </svg>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Connect your wallet</div>
          <div style={{ color: c.textMuted, fontSize: 14.5, maxWidth: 340 }}>Connect to view your holdings and tokens you've launched.</div>
          <div
            onClick={spark(onConnect)}
            className="clickable"
            style={{ padding: '15px 30px', fontWeight: 700, fontSize: 15, background: c.accent, color: '#08080b', clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
          >
            Connect wallet
          </div>
        </div>
      )}
    </div>
  )
}
