export type ThemeName = 'dark' | 'light'

export interface Palette {
  bg: string
  navBg: string
  panel: string
  panelAlt: string
  border: string
  borderStrong: string
  text: string
  textMuted: string
  textFaint: string
  accent: string
  accentSoft: string
  accent2: string
  success: string
  danger: string
}

export const PALETTE: Record<ThemeName, Palette> = {
  dark: {
    bg: '#08080b', navBg: 'rgba(8,8,11,0.72)', panel: '#131319', panelAlt: '#1b1b24',
    border: 'rgba(255,255,255,0.09)', borderStrong: 'rgba(255,255,255,0.18)',
    text: '#f4f4f7', textMuted: '#93939f', textFaint: '#5c5c68',
    accent: '#e9ff2e', accentSoft: 'rgba(233,255,46,0.10)', accent2: '#8b5cf6',
    success: '#3ddc84', danger: '#ff5470',
  },
  light: {
    bg: '#f8f8f6', navBg: 'rgba(248,248,246,0.78)', panel: '#ffffff', panelAlt: '#efefec',
    border: 'rgba(10,10,15,0.10)', borderStrong: 'rgba(10,10,15,0.20)',
    text: '#0d0d12', textMuted: '#5c5c68', textFaint: '#93939f',
    accent: '#a8b400', accentSoft: 'rgba(168,180,0,0.10)', accent2: '#7c3aed',
    success: '#1f9d5c', danger: '#e0304f',
  },
}

export const HUES = ['#e9ff2e', '#8b5cf6', '#3ddc84', '#ff5470', '#4fd1ff', '#ff9f4a']
