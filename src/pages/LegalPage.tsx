import { useAppContext } from '../AppContext'
import type { LegalTab } from '../types'

const TERMS_SECTIONS = [
  { title: '1. Acceptance', body: 'By accessing Blitzr.Fun you agree to these Terms. If you disagree, do not use the app.' },
  { title: '2. Non-custodial protocol', body: 'Blitzr is a set of smart contracts. We never hold your funds, private keys, or tokens — all deploys, trades, and claims execute directly from your wallet.' },
  { title: '3. Permanent liquidity', body: 'Tokens launched via Blitzr seed 100% of supply as one-sided liquidity that is permanently locked on-chain. This action is irreversible and cannot be undone by us, the creator, or any third party.' },
  { title: '4. No financial advice', body: 'Nothing on this site is investment, legal, or tax advice. Tokens launched by third parties carry total loss risk. Do your own research.' },
  { title: '5. Fees', body: 'A fixed native-token launch fee and an ongoing swap fee, claimable by the creator, apply as disclosed in the app at time of transaction.' },
  { title: '6. Prohibited use', body: 'You may not use Blitzr to launch tokens that are fraudulent, infringing, or in violation of applicable law in your jurisdiction.' },
  { title: '7. No warranty', body: 'The protocol is provided "as is." Smart contracts may contain bugs. We disclaim all warranties to the fullest extent permitted by law.' },
]

const PRIVACY_SECTIONS = [
  { title: '1. What we collect', body: 'Blitzr does not require accounts, emails, or KYC. We collect only what your browser sends automatically (basic device/analytics data) and public on-chain activity tied to wallets you connect.' },
  { title: '2. Wallet data', body: 'Connecting a wallet shares your public address with the app. We never request or store private keys or seed phrases.' },
  { title: '3. Cookies & local storage', body: 'We use local storage for theme preference and session state only — no third-party ad tracking.' },
  { title: '4. On-chain transparency', body: 'Every launch, trade, and fee claim is a public blockchain transaction. It is permanently visible to anyone, independent of this site.' },
  { title: '5. Third parties', body: 'We do not sell personal data. Aggregate, anonymized analytics may be shared with infrastructure providers to keep the app running.' },
  { title: '6. Changes', body: 'We may update this policy as the protocol evolves. Continued use after changes means you accept the revised policy.' },
  { title: '7. Contact', body: 'Questions about this policy can be raised through our official community channels linked in the footer.' },
]

export default function LegalPage({ tab, onSetTab }: { tab: LegalTab; onSetTab: (t: LegalTab) => void }) {
  const { c, spark, isMobile } = useAppContext()
  const pagePad = isMobile ? '28px 16px 60px' : '44px 28px 80px'
  const sections = tab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS
  const title = tab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'

  return (
    <div data-screen-label="Legal" style={{ maxWidth: 760, margin: '0 auto', padding: pagePad }}>
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${c.border}`, marginBottom: 28 }}>
        <div
          onClick={spark(() => onSetTab('terms'))}
          className="clickable"
          style={{ padding: '12px 18px', fontSize: 14, fontWeight: 700, color: tab === 'terms' ? c.text : c.textFaint, borderBottom: `2px solid ${tab === 'terms' ? c.accent : 'transparent'}` }}
        >
          Terms &amp; Conditions
        </div>
        <div
          onClick={spark(() => onSetTab('privacy'))}
          className="clickable"
          style={{ padding: '12px 18px', fontSize: 14, fontWeight: 700, color: tab === 'privacy' ? c.text : c.textFaint, borderBottom: `2px solid ${tab === 'privacy' ? c.accent : 'transparent'}` }}
        >
          Privacy Policy
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>{title}</h1>
          <div style={{ color: c.textFaint, fontSize: 13 }}>Last updated July 16, 2026</div>
        </div>
        {sections.map((s) => (
          <div key={s.title}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: c.textMuted }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
