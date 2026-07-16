import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext, type SparkFn } from './AppContext'
import Nav from './components/Nav'
import { playBlitz, playSpark } from './audio'
import { areaPath, CURATED_SEEDS, fmtUsd, seeded, sparkPath, TOKEN_SEEDS } from './data'
import { HUES, PALETTE } from './theme'
import ExplorePage from './pages/ExplorePage'
import TokenDetailPage from './pages/TokenDetailPage'
import LaunchPage from './pages/LaunchPage'
import PortfolioPage from './pages/PortfolioPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LegalPage from './pages/LegalPage'
import type { ChatMessage, CtoInfo, LaunchForm, Page, Token } from './types'
import type { TokenSeed } from './data'

const DEFAULT_LAUNCH_FORM: LaunchForm = {
  name: '', ticker: '', description: '', stack: 'v3', quoteToken: 'WETH',
  instantBuyEth: '', feeWallet: '', burnEnabled: true,
}

function buildToken(seed: TokenSeed, idx: number, theme: 'dark' | 'light'): Token {
  const c = PALETTE[theme]
  const rnd = seeded(seed.id.length * 97 + idx * 13 + 7)
  const pts = Array.from({ length: 24 }, () => seed.basePrice * (0.7 + rnd() * 0.6))
  const change = (rnd() - 0.4) * 38
  const line = sparkPath(pts, 300, 90, 6)
  const lastTradedMins = Math.floor(rnd() * 180)
  return {
    ...seed,
    quote: seed.quote || 'WETH',
    priceStr: '$' + seed.basePrice.toFixed(seed.basePrice < 0.01 ? 6 : 4),
    changeVal: change,
    changeStr: (change >= 0 ? '+' : '') + change.toFixed(1) + '%',
    changeColor: change >= 0 ? c.success : c.danger,
    changePositive: change >= 0,
    mcapStr: fmtUsd(seed.mcap),
    liquidityPct: seed.isCurated ? '—' : '100%',
    holdersStr: seed.isCurated ? '—' : seed.holders.toLocaleString(),
    initial: seed.ticker[0],
    hue: HUES[idx % HUES.length],
    sparkPath: line,
    sparkArea: areaPath(line, 300, 90, 6),
    points: pts,
    stackLabel: seed.isCurated ? 'Curated' : seed.stack === 'v4' ? 'xBlitzr' : 'Blitzr',
    stackColor: seed.isCurated ? c.textMuted : seed.stack === 'v4' ? c.accent2 : c.accent,
    isCurated: !!seed.isCurated,
    burnEnabled: seed.burnEnabled || false,
    feeSplitLabel: (seed.burnEnabled || false) ? '🔥 Burned on claim' : '70% creator / 30% platform',
    pendingFeesEth: seed.pendingFeesEth || 0,
    pendingFeesStr: (seed.pendingFeesEth || 0).toFixed(3) + ' ETH',
    antiBotActive: (seed.antiBotBlocksLeft || 0) > 0,
    lastTradedMins,
    lastTradedStr: lastTradedMins < 1 ? 'just now' : lastTradedMins < 60 ? lastTradedMins + 'm ago' : Math.floor(lastTradedMins / 60) + 'h ago',
  }
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [page, setPage] = useState<Page>('explore')
  const [walletConnected, setWalletConnected] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedTokenId, setSelectedTokenId] = useState('volt')
  const [extraTokens, setExtraTokens] = useState<TokenSeed[]>([])
  const [burnOverrides, setBurnOverrides] = useState<Record<string, boolean>>({})
  const [claimedFees, setClaimedFees] = useState<Record<string, boolean>>({})
  const [ctoTokens, setCtoTokens] = useState<Record<string, CtoInfo>>({})
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({})
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms')

  const [launchStep, setLaunchStep] = useState(0)
  const [launchForm, setLaunchForm] = useState<LaunchForm>(DEFAULT_LAUNCH_FORM)
  const [launchAgree, setLaunchAgree] = useState(false)
  const [launchDeploying, setLaunchDeploying] = useState(false)
  const [launchDeployed, setLaunchDeployed] = useState(false)
  const [launchDeployAddr, setLaunchDeployAddr] = useState('')

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 760)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const spark: SparkFn = useCallback((handler) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()
      playSpark()
      handler?.()
    }
  }, [])

  const tokens = useMemo(() => {
    const all = [...extraTokens, ...TOKEN_SEEDS, ...CURATED_SEEDS]
    return all.map((seed, idx) => {
      const burnEnabled = burnOverrides[seed.id] !== undefined ? burnOverrides[seed.id] : seed.burnEnabled || false
      const pendingFeesEth = claimedFees[seed.id] ? 0 : seed.pendingFeesEth || 0
      const base = buildToken(seed, idx, theme)
      return { ...base, burnEnabled, feeSplitLabel: burnEnabled ? '🔥 Burned on claim' : '70% creator / 30% platform', pendingFeesEth, pendingFeesStr: pendingFeesEth.toFixed(3) + ' ETH' }
    })
  }, [extraTokens, theme, burnOverrides, claimedFees])

  const selected = tokens.find((t) => t.id === selectedTokenId) || tokens[0]

  const c = PALETTE[theme]
  const isDark = theme === 'dark'

  const openToken = useCallback((id: string) => {
    setSelectedTokenId(id)
    setPage('token')
  }, [])

  const navigate = useCallback((p: Page) => setPage(p), [])

  const toggleTheme = useCallback(() => {
    playBlitz()
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const toggleWallet = useCallback(() => {
    playBlitz()
    setWalletConnected((v) => !v)
  }, [])

  const deploy = useCallback(() => {
    playBlitz()
    setLaunchDeploying(true)
    setTimeout(() => {
      playBlitz()
      const addr =
        '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
        '…' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      const newTok: TokenSeed = {
        id: (launchForm.ticker || 'NEW').toLowerCase() + Date.now(),
        name: launchForm.name || 'New Token',
        ticker: launchForm.ticker || 'NEW',
        basePrice: 0.0005 + Math.random() * 0.002,
        mcap: 50000 + Math.random() * 100000,
        holders: 1,
        isNew: true,
        stack: launchForm.stack,
        quote: launchForm.quoteToken,
        burnEnabled: launchForm.burnEnabled,
        pendingFeesEth: 0,
        antiBotBlocksLeft: 10,
        description: launchForm.description || 'Freshly launched on Blitzr.',
      }
      setLaunchDeploying(false)
      setLaunchDeployed(true)
      setLaunchDeployAddr(addr)
      setExtraTokens((s) => [newTok, ...s])
      setSelectedTokenId(newTok.id)
    }, 1800)
  }, [launchForm])

  const resetLaunch = useCallback(() => {
    setLaunchStep(0)
    setLaunchDeployed(false)
    setLaunchAgree(false)
    setLaunchForm(DEFAULT_LAUNCH_FORM)
  }, [])

  const holdings = useMemo(() => {
    const amounts = [12000, 480, 3.2]
    return tokens.slice(0, 3).map((t, i) => ({
      token: t,
      amountStr: amounts[i].toLocaleString(),
      valueStr: fmtUsd(amounts[i] * t.basePrice),
    }))
  }, [tokens])

  const launchedTokens = useMemo(() => extraTokens.map((t) => tokens.find((x) => x.id === t.id)).filter((t): t is Token => !!t), [extraTokens, tokens])

  const contextValue = useMemo(() => ({ c, isDark, spark, isMobile }), [c, isDark, spark, isMobile])

  return (
    <AppContext.Provider value={contextValue}>
      <div
        style={{
          minHeight: '100vh',
          background: c.bg,
          color: c.text,
          transition: 'background .25s,color .25s',
          position: 'relative',
          overflowX: 'hidden',
          paddingBottom: isMobile ? 70 : 0,
        }}
      >
        <Nav page={page} onNavigate={navigate} isDark={isDark} onToggleTheme={toggleTheme} walletConnected={walletConnected} onToggleWallet={toggleWallet} />

        {page === 'explore' && (
          <ExplorePage
            tokens={tokens}
            onOpenToken={openToken}
            onGoLaunch={() => navigate('launch')}
            onGoAnalytics={() => navigate('analytics')}
            onGoTerms={() => { setLegalTab('terms'); navigate('legal') }}
            onGoPrivacy={() => { setLegalTab('privacy'); navigate('legal') }}
          />
        )}

        {page === 'token' && selected && (
          <TokenDetailPage
            token={selected}
            extra={{
              burnEnabled: selected.burnEnabled,
              onToggleBurn: () => setBurnOverrides((s) => ({ ...s, [selected.id]: !selected.burnEnabled })),
              pendingFeesEth: selected.pendingFeesEth,
              onClaimFees: () => {
                if (selected.pendingFeesEth <= 0) return
                playBlitz()
                setClaimedFees((s) => ({ ...s, [selected.id]: true }))
              },
              ctoInfo: ctoTokens[selected.id] || null,
              onSubmitCto: (form) => setCtoTokens((s) => ({ ...s, [selected.id]: form })),
              chatMessages: chatMessages[selected.id] || [],
              onSendChat: (msg) =>
                setChatMessages((s) => ({
                  ...s,
                  [selected.id]: [...(s[selected.id] || []), { who: 'You', msg, mine: true }],
                })),
            }}
          />
        )}

        {page === 'launch' && (
          <LaunchPage
            step={launchStep}
            form={launchForm}
            agree={launchAgree}
            deploying={launchDeploying}
            deployed={launchDeployed}
            deployAddress={launchDeployAddr}
            onFormChange={(patch) => setLaunchForm((f) => ({ ...f, ...patch }))}
            onSetAgree={setLaunchAgree}
            onNext={() => setLaunchStep((s) => Math.min(3, s + 1))}
            onBack={() => setLaunchStep((s) => Math.max(0, s - 1))}
            onDeploy={deploy}
            onViewToken={() => navigate('token')}
            onReset={resetLaunch}
          />
        )}

        {page === 'portfolio' && (
          <PortfolioPage connected={walletConnected} address="0x71C7...9e3F" holdings={holdings} launched={launchedTokens} onOpenToken={openToken} onConnect={toggleWallet} />
        )}

        {page === 'analytics' && <AnalyticsPage tokens={tokens} onOpenToken={openToken} />}

        {page === 'legal' && <LegalPage tab={legalTab} onSetTab={setLegalTab} />}
      </div>
    </AppContext.Provider>
  )
}
