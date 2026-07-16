import { useAppContext } from '../AppContext'
import type { Token } from '../types'

export default function TokenCard({ tok, onOpen }: { tok: Token; onOpen: () => void }) {
  const { c, spark } = useAppContext()
  return (
    <div
      onClick={spark(onOpen)}
      className="clickable"
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        clipPath: 'polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: tok.hue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 13,
              color: '#08080b',
              clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)',
            }}
          >
            {tok.initial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: c.text }}>{tok.name}</div>
            <div style={{ fontSize: 12, color: c.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{tok.ticker}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flex: 'none' }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: tok.stackColor,
              border: `1px solid ${tok.stackColor}66`,
              padding: '3px 6px',
              letterSpacing: '.02em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {tok.stackLabel}
          </span>
          {tok.isNew && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: '#08080b',
                background: c.accent,
                padding: '3px 7px',
                letterSpacing: '.03em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              NEW
            </span>
          )}
        </div>
      </div>
      <svg viewBox="0 0 300 90" width="100%" height="64" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`cardFill-${tok.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tok.changeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={tok.changeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={tok.sparkArea} fill={`url(#cardFill-${tok.id})`} />
        <path d={tok.sparkPath} fill="none" stroke={tok.changeColor} strokeWidth="2" />
      </svg>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11.5, color: c.textFaint, fontWeight: 600 }}>PRICE</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: c.text }}>{tok.priceStr}</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: tok.changeColor }}>{tok.changeStr}</div>
      </div>
    </div>
  )
}
