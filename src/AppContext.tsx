import { createContext, useContext } from 'react'
import type { Palette } from './theme'

export type SparkFn = (handler?: () => void) => (e: React.MouseEvent) => void

export interface AppContextValue {
  c: Palette
  isDark: boolean
  spark: SparkFn
  isMobile: boolean
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppContext.Provider')
  return ctx
}
