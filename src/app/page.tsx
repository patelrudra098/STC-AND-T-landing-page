'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ============================================
   PREMIUM COLOR SYSTEM — WCAG AAA Compliant
   Deep warm golds on pure black
   ============================================ */
const COLORS = {
  gold: '#C9A84C',
  goldLight: '#D4B96A',
  goldDark: '#A68A3E',
  goldPale: '#E2CB82',
  goldGlow: 'rgba(201, 168, 76, 0.15)',
  goldGlowStrong: 'rgba(201, 168, 76, 0.25)',
  black: '#030303',
  white: '#F5F5F0',
  whiteSoft: 'rgba(245, 245, 240, 0.55)',
  whiteFaint: 'rgba(245, 245, 240, 0.3)',
}

/* ============================================
   NOISE TEXTURE OVERLAY — Film grain feel
   ============================================ */
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 3, opacity: 0.025, mixBlendMode: 'overlay' }}
    >
      <svg width="100%" height="100%">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  )
}

/* ============================================
   STARFIELD CANVAS — Premium twinkling stars
   ============================================ */
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Array<{
    x: number; y: number; size: number; baseOpacity: number;
    twinkleSpeed: number; twinklePhase: number; warmth: number;
  }>>([])
  const animFrameRef = useRef<number>(0)

  const initStars = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 3000)
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.2,
      baseOpacity: Math.random() * 0.4 + 0.08,
      twinkleSpeed: Math.random() * 0.006 + 0.001,
      twinklePhase: Math.random() * Math.PI * 2,
      warmth: Math.random(),
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase)
        const alpha = star.baseOpacity * (0.4 + 0.6 * (twinkle * 0.5 + 0.5))

        const r = Math.round(180 + star.warmth * 40)
        const g = Math.round(170 + star.warmth * 20 - (1 - star.warmth) * 30)
        const b = Math.round(60 + (1 - star.warmth) * 140)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()

        if (star.size > 1.0 && alpha > 0.25) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2)
          const grad = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          )
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`)
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = grad
          ctx.fill()
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [initStars])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ animation: 'starsFadeIn 2.5s ease-out forwards', zIndex: 1 }}
    />
  )
}

/* ============================================
   LOGO TEXT — STC & T with premium serif
   Left-to-right reveal animation
   ============================================ */
function LogoText({
  size = 'large',
  animated = true,
  baseDelay = 0.8,
  shimmer = false,
}: {
  size?: 'large' | 'small'
  animated?: boolean
  baseDelay?: number
  shimmer?: boolean
}) {
  const letters = ['S', 'T', 'C', '\u2002', '&', '\u2002', 'T']
  const isLarge = size === 'large'

  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        position: 'relative',
        animation: shimmer ? 'logoFloat 6s ease-in-out infinite' : 'none',
      }}
    >
      {/* Ambient glow behind text */}
      {animated && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${COLORS.goldGlow} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animation: `fadeInSoft 1s ease-out ${baseDelay + 0.3}s both`,
          }}
        />
      )}

      {/* Breathing glow for shimmer mode */}
      {shimmer && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(201, 168, 76, 0.08) 0%, transparent 60%)`,
            filter: 'blur(60px)',
            animation: 'breatheGlow 4s ease-in-out infinite',
          }}
        />
      )}

      {letters.map((letter, i) => {
        const isSpace = letter === '\u2002'
        if (isSpace) {
          return (
            <span
              key={`space-${i}`}
              style={{
                width: isLarge ? '0.25em' : '0.18em',
                display: 'inline-block',
              }}
            />
          )
        }

        const charDelay = baseDelay + i * 0.2
        const charIndex = i
        const yOffset = [0, -1, 0.5, 0, -0.5, 0, 1][charIndex] || 0

        return (
          <span
            key={`char-${i}`}
            className="inline-block"
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", "Georgia", serif',
              fontSize: isLarge ? 'clamp(3.5rem, 10vw, 8rem)' : 'clamp(1rem, 2.5vw, 1.5rem)',
              fontWeight: isLarge ? 500 : 600,
              letterSpacing: isLarge ? '0.05em' : '0.04em',
              lineHeight: 1,
              // Premium gold gradient with shimmer
              background: isLarge
                ? `linear-gradient(170deg, ${COLORS.goldPale} 0%, ${COLORS.gold} 35%, ${COLORS.goldDark} 65%, ${COLORS.gold} 100%)`
                : COLORS.gold,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transform: `translateY(${yOffset}px)`,
              animation: animated
                ? `letterReveal 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) ${charDelay}s both`
                : 'none',
              filter: `drop-shadow(0 0 30px ${COLORS.goldGlow})`,
              position: 'relative',
            }}
          >
            {/* Shimmer sweep overlay */}
            {shimmer && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  animation: 'shimmerSweep 3s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            )}
            {letter}
          </span>
        )
      })}
    </div>
  )
}

/* ============================================
   FLOATING GOLD PARTICLES — Ambient engagement
   ============================================ */
function GoldParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    size: 2 + Math.random() * 3,
    delay: i * 0.8 + Math.random() * 2,
    duration: 8 + Math.random() * 6,
    opacity: 0.1 + Math.random() * 0.15,
    drift: (Math.random() - 0.5) * 60,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 4 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(201, 168, 76, ${p.opacity}) 0%, rgba(201, 168, 76, 0) 70%)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(201, 168, 76, ${p.opacity * 0.5})`,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}
    </div>
  )
}

/* ============================================
   PAGE 1 — THE ENTRANCE
   STC & T reveal + tagline only
   ============================================ */
function EntranceContent() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      {/* STC & T Logo — big in center */}
      <LogoText size="large" animated={true} baseDelay={0.8} />

      {/* Spacer */}
      <div className="h-6 md:h-8" />

      {/* Tagline */}
      <p
        style={{
          fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          fontWeight: 300,
          letterSpacing: '0.4em',
          color: COLORS.whiteSoft,
          animation: 'fadeInSoft 0.8s ease-out 2.8s both',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Built for what&apos;s next
      </p>
    </div>
  )
}

/* ============================================
   PAGE 2 — COMING SOON
   STC & T centered with engaging animations
   ============================================ */
function ComingSoonPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 11,
        animation: 'pageFadeIn 1.2s ease-out both',
      }}
    >
      {/* Floating gold particles */}
      <GoldParticles />

      {/* STC & T Logo — with shimmer and floating */}
      <div className="relative" style={{ animation: 'fadeInSoft 1s ease-out 0.3s both' }}>
        {/* Breathing ambient glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '400px',
            height: '200px',
            background: `radial-gradient(ellipse at center, rgba(201, 168, 76, 0.1) 0%, transparent 60%)`,
            filter: 'blur(60px)',
            animation: 'breatheGlow 4s ease-in-out infinite',
          }}
        />
        <LogoText size="large" animated={false} shimmer={true} />
      </div>

      {/* Spacer */}
      <div className="h-5 md:h-6" />

      {/* Tagline */}
      <p
        style={{
          fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          fontWeight: 300,
          letterSpacing: '0.4em',
          color: COLORS.whiteSoft,
          textTransform: 'uppercase',
          animation: 'fadeInSoft 0.8s ease-out 0.8s both',
        }}
      >
        Built for what&apos;s next
      </p>

      {/* Spacer */}
      <div className="h-10 md:h-14" />

      {/* Divider line — pulsing */}
      <div
        style={{
          width: '80px',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
          animation: 'fadeInSoft 0.6s ease-out 1.2s both, pulseLine 3s ease-in-out 2s infinite',
        }}
      />

      {/* Spacer */}
      <div className="h-8 md:h-10" />

      {/* Coming Soon — with subtle letter spacing animation */}
      <p
        style={{
          fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)',
          fontWeight: 300,
          letterSpacing: '0.5em',
          color: COLORS.white,
          textTransform: 'uppercase',
          animation: 'fadeInSoft 0.8s ease-out 1.5s both, breatheText 5s ease-in-out 2.5s infinite',
        }}
      >
        Coming Soon
      </p>
    </div>
  )
}

/* ============================================
   MAIN PAGE — Seamless cross-fade transition
   ============================================ */
export default function Home() {
  const [showEntrance, setShowEntrance] = useState(true)
  const [entranceFading, setEntranceFading] = useState(false)
  const [showComing, setShowComing] = useState(false)

  useEffect(() => {
    // Start fading entrance at 4s (faster overall entrance)
    const fadeTimer = setTimeout(() => setEntranceFading(true), 4000)
    // Start coming soon at 4.8s (cross-fade overlap)
    const comingTimer = setTimeout(() => setShowComing(true), 4800)
    // Remove entrance at 5.5s
    const removeTimer = setTimeout(() => setShowEntrance(false), 5500)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(comingTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return (
    <main
      className="relative w-full h-screen overflow-hidden"
      style={{ background: COLORS.black }}
    >
      {/* Ambient vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
          zIndex: 2,
        }}
      />

      {/* Subtle warm center glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 35% at center, rgba(201, 168, 76, 0.02) 0%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* Starfield */}
      <Starfield />

      {/* Noise texture */}
      <NoiseOverlay />

      {/* Page content — cross-fade */}
      {showEntrance && (
        <div
          className="fixed inset-0"
          style={{
            zIndex: 10,
            opacity: entranceFading ? 0 : 1,
            transition: 'opacity 1s ease-in-out',
            pointerEvents: entranceFading ? 'none' : 'auto',
          }}
        >
          <EntranceContent />
        </div>
      )}
      {showComing && <ComingSoonPage />}
    </main>
  )
}
