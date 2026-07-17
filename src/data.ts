export interface TokenSeed {
  id: string
  name: string
  ticker: string
  basePrice: number
  mcap: number
  holders: number
  isNew: boolean
  isCurated?: boolean
  isBonding?: boolean
  bondingTargetEth?: number
  bondingRaisedEth?: number
  stack?: 'v3' | 'v4'
  quote?: 'WETH' | 'USDC'
  pendingFeesEth?: number
  antiBotBlocksLeft?: number
  website?: string
  twitter?: string
  telegram?: string
  description: string
}

export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function fmtUsd(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K'
  return '$' + n.toFixed(2)
}

export function sparkPath(vals: number[], w: number, h: number, pad: number): string {
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = (max - min) || 1
  const step = (w - pad * 2) / (vals.length - 1)
  return vals
    .map((v, i) => {
      const x = pad + i * step
      const y = pad + (h - pad * 2) * (1 - (v - min) / range)
      return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1)
    })
    .join(' ')
}

export function areaPath(linePath: string, w: number, h: number, pad: number): string {
  return linePath + ` L ${(w - pad).toFixed(1)} ${(h - pad).toFixed(1)} L ${pad.toFixed(1)} ${(h - pad).toFixed(1)} Z`
}

export const TOKEN_SEEDS: TokenSeed[] = [
  { id: 'volt', name: 'Voltage', ticker: 'VOLT', basePrice: 0.0042, mcap: 4200000, holders: 3120, isNew: false, stack: 'v3', quote: 'WETH', pendingFeesEth: 0.842, antiBotBlocksLeft: 0, website: 'voltage.fun', twitter: '@voltagefun', telegram: 't.me/voltagefun', description: 'A high-frequency payments rail token, seeded with permanent one-sided liquidity from day one.' },
  { id: 'thundr', name: 'Thunderhead', ticker: 'THUNDR', basePrice: 0.00081, mcap: 810000, holders: 980, isNew: true, stack: 'v4', quote: 'WETH', pendingFeesEth: 0.031, antiBotBlocksLeft: 6, website: 'thunderhead.xyz', twitter: '@thundrhead', telegram: 't.me/thundrhead', description: 'Community-run weather-derivatives experiment. Launched on xBlitzr V4 hooks.' },
  { id: 'stc', name: 'Static', ticker: 'STC', basePrice: 0.156, mcap: 15600000, holders: 8420, isNew: false, stack: 'v3', quote: 'USDC', pendingFeesEth: 2.114, antiBotBlocksLeft: 0, website: 'static.markets', twitter: '@staticmarkets', telegram: 't.me/staticmarkets', description: 'Volatility index token tracking on-chain gas markets.' },
  { id: 'surge', name: 'Surge', ticker: 'SURGE', basePrice: 0.0231, mcap: 2310000, holders: 2210, isNew: false, stack: 'v4', quote: 'WETH', pendingFeesEth: 0.512, antiBotBlocksLeft: 0, website: 'surgeprotocol.io', twitter: '@surgeprotocol', telegram: 't.me/surgeprotocol', description: 'Momentum-trading rewards token for the Surge trading league.' },
  { id: 'amp', name: 'Ampere', ticker: 'AMP', basePrice: 1.42, mcap: 42000000, holders: 15400, isNew: false, stack: 'v3', quote: 'WETH', pendingFeesEth: 5.203, antiBotBlocksLeft: 0, website: 'ampere.energy', twitter: '@ampereenergy', telegram: 't.me/ampereenergy', description: 'Backed by a DePIN network of EV-charging nodes.' },
  { id: 'flsh', name: 'Flashpoint', ticker: 'FLSH', basePrice: 0.00013, mcap: 130000, holders: 410, isNew: true, stack: 'v3', quote: 'WETH', pendingFeesEth: 0.008, antiBotBlocksLeft: 9, website: 'flashpoint.fun', twitter: '@flashpointfun', telegram: 't.me/flashpointfun', description: 'Fresh degen launch — anti-bot window still active.' },
  { id: 'grid', name: 'Gridlock', ticker: 'GRID', basePrice: 0.0067, mcap: 6700000, holders: 4030, isNew: false, stack: 'v4', quote: 'USDC', pendingFeesEth: 0.734, antiBotBlocksLeft: 0, website: 'gridlock.network', twitter: '@gridlocknet', telegram: 't.me/gridlocknet', description: 'Grid-balancing incentive token for renewable energy DAOs.' },
  { id: 'ovrc', name: 'Overclock', ticker: 'OVRC', basePrice: 0.334, mcap: 33400000, holders: 11200, isNew: false, stack: 'v3', quote: 'WETH', pendingFeesEth: 3.87, antiBotBlocksLeft: 0, website: 'overclock.gg', twitter: '@overclockgg', telegram: 't.me/overclockgg', description: 'Esports staking and prediction markets token.' },
]

export const BONDING_SEEDS: TokenSeed[] = [
  { id: 'zapd', name: 'Zapped', ticker: 'ZAPD', basePrice: 0.0000042, mcap: 18400, holders: 64, isNew: true, isBonding: true, bondingTargetEth: 24, bondingRaisedEth: 6.8, description: 'Fresh bonding-curve launch — still raising toward its migration target.' },
]

export const CURATED_SEEDS: TokenSeed[] = [
  { id: 'wbtc', name: 'Wrapped Bitcoin', ticker: 'WBTC', basePrice: 64200, mcap: 12500000000, holders: 0, isNew: false, isCurated: true, description: 'Bitcoin, bridged on-chain. Curated for trading — not launched on Blitzr.' },
  { id: 'link', name: 'Chainlink', ticker: 'LINK', basePrice: 14.2, mcap: 9100000000, holders: 0, isNew: false, isCurated: true, description: 'Oracle network token. Curated for trading — not launched on Blitzr.' },
  { id: 'uni', name: 'Uniswap', ticker: 'UNI', basePrice: 9.8, mcap: 5900000000, holders: 0, isNew: false, isCurated: true, description: 'Governance token of the Uniswap protocol. Curated for trading — not launched on Blitzr.' },
]
