import type { Palette } from '../theme'

export interface Spark {
  id: number
  left: string
  top: string
}

export default function SparkOverlay({ sparks, c }: { sparks: Spark[]; c: Palette }) {
  return (
    <>
      {sparks.map((sp) => (
        <svg
          key={sp.id}
          width="70"
          height="70"
          viewBox="0 0 70 70"
          style={{
            position: 'fixed',
            left: sp.left,
            top: sp.top,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'translate(-50%,-50%)',
            animation: 'sparkPop .5s ease-out forwards',
          }}
        >
          <path
            d="M38 6 L18 38 H32 L26 64 L54 30 H38 L42 6 Z"
            fill={c.accent}
            style={{ filter: `drop-shadow(0 0 10px ${c.accent})` }}
          />
        </svg>
      ))}
    </>
  )
}
