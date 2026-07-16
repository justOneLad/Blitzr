import { useAppContext } from '../AppContext'
import type { Page } from '../types'

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'launch', label: 'Launch' },
  { id: 'portfolio', label: 'Portfolio' },
]

const BOTTOM_ITEMS: { id: Page; label: string; icon: 'explore' | 'launch' | 'portfolio' }[] = [
  { id: 'explore', label: 'Explore', icon: 'explore' },
  { id: 'launch', label: 'Launch', icon: 'launch' },
  { id: 'portfolio', label: 'Portfolio', icon: 'portfolio' },
]

export default function Nav({
  page,
  onNavigate,
  isDark,
  onToggleTheme,
  walletConnected,
  onToggleWallet,
}: {
  page: Page
  onNavigate: (p: Page) => void
  isDark: boolean
  onToggleTheme: () => void
  walletConnected: boolean
  onToggleWallet: () => void
}) {
  const { c, spark, isMobile } = useAppContext()

  const walletLabel = walletConnected ? '0x71C7…9e3F' : 'Connect Wallet'
  const walletBtnBg = walletConnected ? c.panelAlt : c.accent
  const walletBtnColor = walletConnected ? c.text : '#08080b'
  const walletBtnBorder = walletConnected ? c.border : 'transparent'

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: isMobile ? '0 14px' : '0 28px',
          height: 64,
          background: c.navBg,
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${c.border}`,
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 36, minWidth: 0 }}>
          <div
            onClick={spark(() => onNavigate('explore'))}
            className="clickable"
            style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 8px ${c.accent}66)`, flex: 'none' }}>
              <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill={c.accent} />
            </svg>
            <span style={{ fontWeight: 800, fontSize: isMobile ? 16 : 19, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              BLITZR<span style={{ color: c.accent }}>.</span>FUN
            </span>
          </div>
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_ITEMS.map((item) => {
              const active = page === item.id
              return (
                <div
                  key={item.id}
                  onClick={spark(() => onNavigate(item.id))}
                  className="clickable"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 600,
                    color: active ? '#08080b' : c.textMuted,
                    background: active ? c.accent : 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <div
            onClick={spark(onToggleTheme)}
            className="clickable"
            style={{
              width: 48,
              height: 26,
              borderRadius: 999,
              background: c.panelAlt,
              border: `1px solid ${c.border}`,
              position: 'relative',
              padding: 2,
              flex: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: isDark ? 26 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: c.accent,
                transition: 'left .2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }}
            >
              {isDark ? '⚡' : '☀'}
            </div>
          </div>
          <div
            onClick={spark(onToggleWallet)}
            className="clickable"
            style={{
              padding: '9px 14px',
              fontWeight: 700,
              fontSize: 12.5,
              background: walletBtnBg,
              color: walletBtnColor,
              clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)',
              border: `1px solid ${walletBtnBorder}`,
              whiteSpace: 'nowrap',
            }}
          >
            {walletLabel}
          </div>
        </div>
      </div>

      <div
        style={{
          display: isMobile ? 'flex' : 'none',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          background: c.navBg,
          backdropFilter: 'blur(14px)',
          borderTop: `1px solid ${c.border}`,
          padding: '8px 6px calc(8px + env(safe-area-inset-bottom))',
        }}
      >
        {BOTTOM_ITEMS.map((item) => {
          const active = page === item.id
          return (
            <div
              key={item.id}
              onClick={spark(() => onNavigate(item.id))}
              className="clickable"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '6px 0',
                color: active ? c.accent : c.textFaint,
              }}
            >
              {item.icon === 'explore' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              )}
              {item.icon === 'launch' && (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill="currentColor" />
                </svg>
              )}
              {item.icon === 'portfolio' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                  <path d="M17 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v3" />
                </svg>
              )}
              <span style={{ fontSize: 11, fontWeight: 700 }}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
