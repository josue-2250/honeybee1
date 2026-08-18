import { useState, type CSSProperties, type ReactNode } from 'react'

type PageBackgroundProps = {
  image: string
  overlay?: string
  className?: string
  children: ReactNode
}

export default function PageBackground({
  image,
  overlay = '',
  className = '',
  children,
}: PageBackgroundProps) {
  const [pointer, setPointer] = useState({ x: 50, y: 30 })

  return (
    <div
      className={`romantic-page relative overflow-hidden ${className}`}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        setPointer({
          x: ((event.clientX - bounds.left) / bounds.width) * 100,
          y: ((event.clientY - bounds.top) / bounds.height) * 100,
        })
      }}
      style={{ '--mouse-x': `${pointer.x}%`, '--mouse-y': `${pointer.y}%` } as CSSProperties}
    >
      <div
        aria-hidden
        className="page-photo pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
      {overlay && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${overlay}`}
        />
      )}
      <div aria-hidden className="cursor-bloom pointer-events-none absolute inset-0" />
      <div aria-hidden className="love-particles pointer-events-none absolute inset-0">
        <span>♥</span>
        <span>✦</span>
        <span>♥</span>
        <span>✦</span>
        <span>♥</span>
      </div>
      <div className="relative z-10 flex min-h-full flex-col">{children}</div>
    </div>
  )
}
