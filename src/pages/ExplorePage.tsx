import { useMemo, useState } from 'react'
import { useAppContext } from '../AppContext'
import TokenCard from '../components/TokenCard'
import type { ExploreScope, ExploreSort, ExploreView, Token } from '../types'

const SORT_DEFS: { id: ExploreSort; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'gainers', label: 'Gainers' },
  { id: 'mcap', label: 'Mcap' },
  { id: 'traded', label: 'Last Traded' },
]

const SCOPE_DEFS: { id: ExploreScope; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'launches', label: 'Blitzr Launches' },
  { id: 'curated', label: 'Curated' },
]

export default function ExplorePage({
  tokens,
  onOpenToken,
  onGoLaunch,
  onGoAnalytics,
  onGoTerms,
  onGoPrivacy,
}: {
  tokens: Token[]
  onOpenToken: (id: string) => void
  onGoLaunch: () => void
  onGoAnalytics: () => void
  onGoTerms: () => void
  onGoPrivacy: () => void
}) {
  const { c, spark, isMobile } = useAppContext()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ExploreSort>('new')
  const [scope, setScope] = useState<ExploreScope>('all')
  const [view, setView] = useState<ExploreView>('grid')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    let list = tokens.filter((t) => !q || t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q))
    if (scope === 'curated') list = list.filter((t) => t.isCurated)
    else if (scope === 'launches') list = list.filter((t) => !t.isCurated)
    if (sort === 'new') list = [...list].reverse()
    else if (sort === 'gainers') list = [...list].sort((a, b) => b.changeVal - a.changeVal)
    else if (sort === 'mcap') list = [...list].sort((a, b) => b.mcap - a.mcap)
    else if (sort === 'traded') list = [...list].sort((a, b) => a.lastTradedMins - b.lastTradedMins)
    return list
  }, [tokens, query, scope, sort])

  const pagePad = isMobile ? '28px 16px 60px' : '44px 28px 80px'
  const cardsCols = 'repeat(auto-fit, minmax(240px,1fr))'
  const listMinW = isMobile ? '720px' : '100%'

  return (
    <div data-screen-label="Explore" style={{ maxWidth: 1240, margin: '0 auto', padding: pagePad }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 26 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>Explore launches</h1>
          <div style={{ color: c.textMuted, fontSize: 14.5, marginTop: 6 }}>{filtered.length} tokens</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or ticker"
            style={{
              background: c.panel,
              border: `1px solid ${c.border}`,
              color: c.text,
              padding: '10px 14px',
              fontSize: 14,
              flex: 1,
              minWidth: 140,
              maxWidth: 220,
              clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)',
            }}
          />
          <div style={{ display: 'flex', background: c.panel, border: `1px solid ${c.border}` }}>
            {SORT_DEFS.map((s) => {
              const active = sort === s.id
              return (
                <div
                  key={s.id}
                  onClick={spark(() => setSort(s.id))}
                  className="clickable"
                  style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: active ? '#08080b' : c.textMuted, background: active ? c.accent : 'transparent' }}
                >
                  {s.label}
                </div>
              )
            })}
          </div>
          <div
            onClick={spark(() => setView(view === 'grid' ? 'list' : 'grid'))}
            className="clickable"
            style={{ padding: '9px 12px', border: `1px solid ${c.border}`, background: c.panel, fontSize: 13, color: c.textMuted }}
          >
            {view === 'grid' ? '☰' : '▦'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        {SCOPE_DEFS.map((s) => {
          const active = scope === s.id
          return (
            <div
              key={s.id}
              onClick={spark(() => setScope(s.id))}
              className="clickable"
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: active ? '#08080b' : c.textMuted,
                background: active ? c.accent : 'transparent',
                border: `1px solid ${c.border}`,
              }}
            >
              {s.label}
            </div>
          )
        })}
      </div>

      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: cardsCols, gap: 16 }}>
          {filtered.map((t) => (
            <TokenCard key={t.id} tok={t} onOpen={() => onOpenToken(t.id)} />
          ))}
        </div>
      )}

      {view === 'list' && (
        <div style={{ border: `1px solid ${c.border}`, overflowX: 'auto' }}>
          <div style={{ minWidth: listMinW }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 90px',
                padding: '12px 18px',
                fontSize: 12,
                fontWeight: 700,
                color: c.textFaint,
                letterSpacing: '.05em',
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              <div>TOKEN</div>
              <div>PRICE</div>
              <div>24H</div>
              <div>MCAP</div>
              <div>LIQUIDITY</div>
              <div>LAST TRADED</div>
              <div></div>
            </div>
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={spark(() => onOpenToken(t.id))}
                className="clickable"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 90px',
                  padding: '14px 18px',
                  alignItems: 'center',
                  borderBottom: `1px solid ${c.border}`,
                  background: c.bg,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: t.hue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 12,
                      color: '#08080b',
                      clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: c.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{t.ticker}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5 }}>{t.priceStr}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5, fontWeight: 700, color: t.changeColor }}>{t.changeStr}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5 }}>{t.mcapStr}</div>
                <div style={{ fontSize: 13.5, color: c.textMuted }}>{t.liquidityPct}</div>
                <div style={{ fontSize: 13.5, color: c.textMuted }}>{t.lastTradedStr}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.accent }}>VIEW →</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 70, paddingTop: 32, borderTop: `1px solid ${c.border}`, display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 280, color: c.textFaint, fontSize: 12.5 }}>© 2026 Blitzr.Fun — not financial advice.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: c.textFaint, letterSpacing: '.06em', marginBottom: 2 }}>PRODUCT</div>
            <span onClick={spark(onGoLaunch)} className="clickable" style={{ fontSize: 13, color: c.textMuted }}>Launch</span>
            <span onClick={spark(onGoAnalytics)} className="clickable" style={{ fontSize: 13, color: c.textMuted }}>Analytics</span>
            <a href="#" style={{ fontSize: 13, color: c.textMuted }}>Docs</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: c.textFaint, letterSpacing: '.06em', marginBottom: 2 }}>LEGAL</div>
            <span onClick={spark(onGoTerms)} className="clickable" style={{ fontSize: 13, color: c.textMuted }}>Terms</span>
            <span onClick={spark(onGoPrivacy)} className="clickable" style={{ fontSize: 13, color: c.textMuted }}>Privacy</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: c.textFaint, letterSpacing: '.06em', marginBottom: 2 }}>COMMUNITY</div>
            <a href="#" style={{ fontSize: 13, color: c.textMuted }}>X / Twitter</a>
            <a href="#" style={{ fontSize: 13, color: c.textMuted }}>Discord</a>
            <a href="#" style={{ fontSize: 13, color: c.textMuted }}>Telegram</a>
            <a href="#" style={{ fontSize: 13, color: c.textMuted }}>GitHub</a>
          </div>
        </div>
      </div>
    </div>
  )
}
