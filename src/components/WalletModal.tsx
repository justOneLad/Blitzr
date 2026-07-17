import { useAppContext } from '../AppContext'
import type { WalletModalStep } from '../types'

const EXTERNAL_WALLETS = [
  { name: 'MetaMask', hue: '#f6851b' },
  { name: 'Coinbase Wallet', hue: '#0052ff' },
  { name: 'WalletConnect', hue: '#3b99fc' },
  { name: 'Rabby', hue: '#8697ff' },
]

export default function WalletModal({
  open,
  step,
  email,
  onEmailChange,
  onChooseEmail,
  onSubmitEmail,
  onConnectExternal,
  onClose,
}: {
  open: boolean
  step: WalletModalStep
  email: string
  onEmailChange: (v: string) => void
  onChooseEmail: () => void
  onSubmitEmail: () => void
  onConnectExternal: (name: string) => void
  onClose: () => void
}) {
  const { c, spark } = useAppContext()

  if (!open) return null

  return (
    <div
      onClick={spark(onClose)}
      className="clickable"
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 380, background: c.panel, border: `1px solid ${c.borderStrong}`, clipPath: 'polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill={c.accent} />
            </svg>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Connect a wallet</span>
          </div>
          <div onClick={spark(onClose)} className="clickable" style={{ cursor: 'pointer', color: c.textMuted, fontSize: 18, lineHeight: 1, padding: 4 }}>
            ✕
          </div>
        </div>

        {step === 'options' && (
          <div style={{ padding: 22 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: c.textFaint, letterSpacing: '.06em', marginBottom: 10 }}>EMBEDDED WALLET</div>
            <div
              onClick={spark(onChooseEmail)}
              className="clickable"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', border: `1px solid ${c.border}`, cursor: 'pointer', marginBottom: 22 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Continue with email</div>
                <div style={{ fontSize: 12, color: c.textMuted }}>No seed phrase — powered by Dynamic</div>
              </div>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: c.textFaint, letterSpacing: '.06em', marginBottom: 10 }}>EXTERNAL WALLETS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXTERNAL_WALLETS.map((w) => (
                <div
                  key={w.name}
                  onClick={spark(() => onConnectExternal(w.name))}
                  className="clickable"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `1px solid ${c.border}`, cursor: 'pointer' }}
                >
                  <div style={{ width: 24, height: 24, flex: 'none', background: w.hue, clipPath: 'polygon(4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%,0 4px)' }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, fontSize: 11.5, color: c.textFaint, textAlign: 'center' }}>By connecting, you agree to Blitzr's Terms &amp; Privacy Policy.</div>
          </div>
        )}

        {step === 'email' && (
          <div style={{ padding: 22 }}>
            <div style={{ fontSize: 13.5, color: c.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
              We'll create a secure embedded wallet tied to your email — no extension, no seed phrase.
            </div>
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', background: c.panelAlt, border: `1px solid ${c.border}`, color: c.text, padding: 13, fontSize: 14.5, marginBottom: 14 }}
            />
            <div
              onClick={spark(onSubmitEmail)}
              className="clickable"
              style={{ textAlign: 'center', padding: 14, fontWeight: 700, fontSize: 14.5, cursor: 'pointer', background: c.accent, color: '#08080b', clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
            >
              Send code &amp; continue
            </div>
          </div>
        )}

        {step === 'connecting' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '50px 22px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" style={{ animation: 'spin 1.1s linear infinite' }}>
              <path d="M13 2 L3 14 H10 L8 22 L21 8 H13 L15 2 Z" fill="none" stroke={c.accent} strokeWidth="1.5" />
            </svg>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>Connecting wallet…</div>
          </div>
        )}
      </div>
    </div>
  )
}
