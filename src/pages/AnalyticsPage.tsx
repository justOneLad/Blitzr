import { useMemo } from 'react'
import { useAppContext } from '../AppContext'
import { fmtUsd, seeded } from '../data'
import type { Token } from '../types'

export default function AnalyticsPage({ tokens, onOpenToken }: { tokens: Token[]; onOpenToken: (id: string) => void }) {
  const { c, spark, isMobile } = useAppContext()
  const pagePad = isMobile ? '28px 16px 60px' : '44px 28px 80px'
  const statsCols = 'repeat(auto-fit, minmax(130px,1fr))'
  const tokenGridCols = isMobile ? '1fr' : '2fr 1fr'
  const listMinW = isMobile ? '720px' : '100%'

  const analytics = useMemo(() => {
    const totalLiquidityEth = tokens.reduce((s, t) => s + (t.mcap * 0.18) / 2000, 0)
    const totalVolume24h = tokens.reduce((s, t) => s + t.mcap * 0.18, 0)
    const totalFees = tokens.reduce((s, t) => s + t.pendingFeesEth, 0)
    const v3Count = tokens.filter((t) => t.stack === 'v3').length
    const v4Count = tokens.filter((t) => t.stack === 'v4').length
    const stackTotal = v3Count + v4Count || 1
    const launchSeries = Array.from({ length: 14 }, (_, i) => 1 + Math.floor(seeded(i * 31 + 7)() * 5) + (i > 10 ? 3 : 0))
    const launchMax = Math.max(...launchSeries)
    const bars = launchSeries.map((v) => ({ h: Math.round((v / launchMax) * 100) }))
    const gainers = [...tokens].sort((a, b) => b.changeVal - a.changeVal).slice(0, 5)
    const losers = [...tokens].sort((a, b) => a.changeVal - b.changeVal).slice(0, 5)
    const claimedAllTime = 1842.6, claimed7d = 96.3, claimed24h = 14.8
    const revAllTime = 789.2, rev7d = 41.5, rev24h = 6.1
    const launches24h = 5, launches7d = 28, launchesAllTime = tokens.length
    const breakdown = [
      { label: 'Creator fees claimed', allTime: claimedAllTime.toFixed(1) + ' ETH', d7: claimed7d.toFixed(1) + ' ETH', h24: claimed24h.toFixed(1) + ' ETH' },
      { label: 'Platform revenue', allTime: revAllTime.toFixed(1) + ' ETH', d7: rev7d.toFixed(1) + ' ETH', h24: rev24h.toFixed(1) + ' ETH' },
      { label: 'Launches', allTime: launchesAllTime.toString(), d7: launches7d.toString(), h24: launches24h.toString() },
    ]
    return {
      breakdown,
      totalTokens: tokens.length,
      totalLiquidityStr: totalLiquidityEth.toFixed(0) + ' ETH',
      totalVolumeStr: fmtUsd(totalVolume24h),
      totalFeesStr: totalFees.toFixed(2) + ' ETH',
      v3Pct: Math.round((v3Count / stackTotal) * 100),
      v4Pct: Math.round((v4Count / stackTotal) * 100),
      bars,
      gainers,
      losers,
    }
  }, [tokens])

  return (
    <div data-screen-label="Analytics" style={{ maxWidth: 1240, margin: '0 auto', padding: pagePad }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-.02em' }}>Platform analytics</h1>
      <div style={{ color: c.textMuted, fontSize: 14.5, marginBottom: 28 }}>Aggregate stats across every Blitzr launch</div>

      <div style={{ display: 'grid', gridTemplateColumns: statsCols, gap: 1, background: c.border, border: `1px solid ${c.border}`, marginBottom: 32 }}>
        <div style={{ background: c.bg, padding: 20 }}>
          <div style={{ fontSize: 11.5, color: c.textFaint, fontWeight: 700, letterSpacing: '.05em' }}>TOKENS LAUNCHED</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, marginTop: 6 }}>{analytics.totalTokens}</div>
        </div>
        <div style={{ background: c.bg, padding: 20 }}>
          <div style={{ fontSize: 11.5, color: c.textFaint, fontWeight: 700, letterSpacing: '.05em' }}>LIQUIDITY LOCKED</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, marginTop: 6, color: c.accent }}>{analytics.totalLiquidityStr}</div>
        </div>
        <div style={{ background: c.bg, padding: 20 }}>
          <div style={{ fontSize: 11.5, color: c.textFaint, fontWeight: 700, letterSpacing: '.05em' }}>24H VOLUME</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, marginTop: 6 }}>{analytics.totalVolumeStr}</div>
        </div>
        <div style={{ background: c.bg, padding: 20 }}>
          <div style={{ fontSize: 11.5, color: c.textFaint, fontWeight: 700, letterSpacing: '.05em' }}>UNCLAIMED CREATOR FEES</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, marginTop: 6 }}>{analytics.totalFeesStr}</div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, letterSpacing: '.08em', marginBottom: 12 }}>FEES, REVENUE &amp; LAUNCHES</div>
        <div style={{ border: `1px solid ${c.border}`, overflowX: 'auto' }}>
          <div style={{ minWidth: listMinW }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '12px 18px', fontSize: 11.5, fontWeight: 700, color: c.textFaint, letterSpacing: '.05em', borderBottom: `1px solid ${c.border}` }}>
              <div></div>
              <div>ALL-TIME</div>
              <div>LAST 7 DAYS</div>
              <div>LAST 24H</div>
            </div>
            {analytics.breakdown.map((row) => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', padding: '14px 18px', borderBottom: `1px solid ${c.border}`, alignItems: 'center' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{row.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700 }}>{row.allTime}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>{row.d7}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: c.accent }}>{row.h24}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: tokenGridCols, gap: 20, marginBottom: 32 }}>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, padding: 24, clipPath: 'polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, letterSpacing: '.08em', marginBottom: 18 }}>LAUNCHES — LAST 14 DAYS</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
            {analytics.bars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', background: c.accent, height: `${b.h}%`, minHeight: 4, opacity: 0.85 }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: c.panel, border: `1px solid ${c.border}`, padding: 24, clipPath: 'polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, letterSpacing: '.08em', marginBottom: 18 }}>STACK SPLIT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, width: 70 }}>Blitzr V3</div>
            <div style={{ flex: 1, height: 10, background: c.panelAlt }}>
              <div style={{ height: '100%', width: `${analytics.v3Pct}%`, background: c.accent }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, width: 40, textAlign: 'right' }}>{analytics.v3Pct}%</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, width: 70 }}>xBlitzr V4</div>
            <div style={{ flex: 1, height: 10, background: c.panelAlt }}>
              <div style={{ height: '100%', width: `${analytics.v4Pct}%`, background: c.accent2 }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, width: 40, textAlign: 'right' }}>{analytics.v4Pct}%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: tokenGridCols, gap: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.success, letterSpacing: '.08em', marginBottom: 12 }}>TOP GAINERS (24H)</div>
          <div style={{ border: `1px solid ${c.border}` }}>
            {analytics.gainers.map((t) => (
              <div key={t.id} onClick={spark(() => onOpenToken(t.id))} className="clickable" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, background: t.hue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: '#08080b' }}>{t.initial}</div>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{t.ticker}</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 13.5, color: t.changeColor }}>{t.changeStr}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.danger, letterSpacing: '.08em', marginBottom: 12 }}>TOP LOSERS (24H)</div>
          <div style={{ border: `1px solid ${c.border}` }}>
            {analytics.losers.map((t) => (
              <div key={t.id} onClick={spark(() => onOpenToken(t.id))} className="clickable" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, background: t.hue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: '#08080b' }}>{t.initial}</div>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{t.ticker}</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 13.5, color: t.changeColor }}>{t.changeStr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
