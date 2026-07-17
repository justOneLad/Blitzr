import type { TokenSeed } from './data'

export interface Token extends TokenSeed {
  quote: 'WETH' | 'USDC'
  priceStr: string
  changeVal: number
  changeStr: string
  changeColor: string
  changePositive: boolean
  mcapStr: string
  liquidityPct: string
  holdersStr: string
  initial: string
  hue: string
  sparkPath: string
  sparkArea: string
  points: number[]
  stackLabel: string
  stackColor: string
  isCurated: boolean
  isBonding: boolean
  bondingPct: number
  bondingRaisedEth?: number
  bondingTargetEth?: number
  pendingFeesEth: number
  pendingFeesStr: string
  antiBotActive: boolean
  lastTradedMins: number
  lastTradedStr: string
}

export type Page = 'explore' | 'token' | 'launch' | 'portfolio' | 'analytics' | 'legal'
export type LegalTab = 'terms' | 'privacy'
export type TokenTab = 'activity' | 'holders' | 'chat'
export type TradeMode = 'buy' | 'sell'
export type ExploreView = 'grid' | 'list'
export type ExploreSort = 'new' | 'gainers' | 'mcap' | 'traded'
export type ExploreScope = 'all' | 'launches' | 'curated'

export interface ChatMessage {
  who: string
  msg: string
  mine: boolean
}

export interface CtoInfo {
  description: string
  website: string
  twitter: string
  telegram: string
}

export interface LaunchForm {
  name: string
  ticker: string
  description: string
  launchType: 'direct' | 'bonding'
  stack: 'v3' | 'v4'
  quoteToken: 'WETH' | 'USDC'
  instantBuyEth: string
  feeWallet: string
  migrationTarget: string
}

export type WalletModalStep = 'options' | 'email' | 'connecting'
