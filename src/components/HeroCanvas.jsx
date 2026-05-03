import { useRef, useEffect } from 'react'

/* ── Gold palette ── */
const GOLDS = [
  { r: 255, g: 220, b: 80 },
  { r: 255, g: 190, b: 40 },
  { r: 255, g: 240, b: 160 },
]
const rand = (lo, hi) => lo + Math.random() * (hi - lo)
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

/* ── Four-point sparkle path ── */
function traceStar(ctx, cx, cy, outer, inner, rot) {
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = rot + (i / 8) * Math.PI * 2
    const r = i % 2 === 0 ? outer : inner
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
}

/* ── Factories ── */
function makeStar(W, H, spawnY = null) {
  return {
    x: rand(0, W),
    y: spawnY ?? rand(0, H),
    vx: rand(-0.1, 0.1),
    vy: rand(-0.4, -0.14),
    size: rand(1.0, 3.2),
    baseAlpha: rand(0.45, 1.0),
    alpha: 0,
    phase: rand(0, Math.PI * 2),
    phaseSpeed: rand(0.018, 0.055),
    color: pick(GOLDS),
  }
}

function makeTrail(W, H, spawnY = null) {
  return {
    x: rand(0, W),
    y: spawnY ?? rand(0, H),
    vy: rand(-1.4, -0.55),
    length: rand(38, 130),
    width: rand(0.5, 1.8),
    alpha: rand(0.14, 0.46),
    color: pick(GOLDS),
  }
}

function makeSparkle(W, H, spawnY = null) {
  return {
    x: rand(0, W),
    y: spawnY ?? rand(0, H),
    size: rand(4, 16),
    rot: rand(0, Math.PI / 4),
    rotSpeed: rand(-0.006, 0.006),
    phase: rand(0, Math.PI * 2),
    phaseSpeed: rand(0.02, 0.052),
    color: pick(GOLDS),
    alpha: 0,
    targetAlpha: rand(0.28, 0.82),
    life: 0,
    maxLife: Math.floor(rand(100, 320)),
  }
}

/* ═══════════════════════════════════════ */
export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let W = 0, H = 0
    let stars    = []
    let trails   = []
    let sparkles = []
    let frame    = 0

    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    function resize() {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
      if (!reducedMotionMq.matches) init()
    }

    function init() {
      stars    = Array.from({ length: 80 }, () => makeStar(W, H))
      trails   = Array.from({ length: 12 }, () => makeTrail(W, H))
      sparkles = Array.from({ length: 20 }, () => makeSparkle(W, H))
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H)
      frame++

      /* ── 1. Light trails ── */
      for (let i = 0; i < trails.length; i++) {
        const t = trails[i]
        const grad = ctx.createLinearGradient(t.x, t.y, t.x, t.y - t.length)
        const { r, g, b } = t.color
        grad.addColorStop(0,   `rgba(${r},${g},${b},0)`)
        grad.addColorStop(0.35,`rgba(${r},${g},${b},${t.alpha * 0.55})`)
        grad.addColorStop(1,   `rgba(${r},${g},${b},${t.alpha})`)
        ctx.beginPath()
        ctx.moveTo(t.x, t.y)
        ctx.lineTo(t.x, t.y - t.length)
        ctx.strokeStyle = grad
        ctx.lineWidth = t.width
        ctx.stroke()

        t.y += t.vy
        if (t.y + t.length < 0) {
          trails[i] = makeTrail(W, H, H + rand(10, 120))
        }
      }

      /* ── 2. Constellation lines (every 3rd frame) ── */
      if (frame % 3 === 0) {
        const THRESH = 88
        for (let i = 0; i < stars.length - 1; i++) {
          const a = stars[i]
          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d  = Math.sqrt(dx * dx + dy * dy)
            if (d < THRESH) {
              const lineAlpha =
                (1 - d / THRESH) * 0.20 * Math.min(a.alpha, b.alpha)
              const { r, g, b: bl } = GOLDS[1]
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(${r},${g},${bl},${lineAlpha})`
              ctx.lineWidth = 0.38
              ctx.stroke()
            }
          }
        }
      }

      /* ── 3. Stars ── */
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.phase += s.phaseSpeed
        s.alpha = s.baseAlpha * (0.45 + 0.55 * Math.sin(s.phase))

        const { r, g, b } = s.color

        /* glow halo for larger stars */
        if (s.size > 1.8) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3.5)
          glow.addColorStop(0, `rgba(${r},${g},${b},${s.alpha * 0.32})`)
          glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        /* core dot */
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${s.alpha})`
        ctx.fill()

        s.x += s.vx
        s.y += s.vy
        if (s.y + s.size < 0) {
          stars[i] = makeStar(W, H, H + rand(10, 80))
        }
        if (s.x < -s.size)    s.x = W + s.size
        if (s.x > W + s.size) s.x = -s.size
      }

      /* ── 4. Four-point sparkle bursts ── */
      for (let i = 0; i < sparkles.length; i++) {
        const sp = sparkles[i]
        sp.life++
        sp.phase   += sp.phaseSpeed
        sp.rot     += sp.rotSpeed

        const fadeLen = 35
        if (sp.life < fadeLen) {
          sp.alpha = (sp.life / fadeLen) * sp.targetAlpha
        } else if (sp.life > sp.maxLife - fadeLen) {
          sp.alpha = Math.max(0, ((sp.maxLife - sp.life) / fadeLen) * sp.targetAlpha)
        } else {
          sp.alpha = sp.targetAlpha
        }

        if (sp.life > sp.maxLife) {
          sparkles[i] = makeSparkle(W, H, rand(0, H))
          continue
        }
        if (sp.alpha <= 0.005) continue

        const pulse = 0.72 + 0.28 * Math.sin(sp.phase)
        const outer = sp.size * pulse
        const inner = outer * 0.26
        const { r, g, b } = sp.color

        ctx.save()
        ctx.globalAlpha = sp.alpha

        /* inner fill */
        traceStar(ctx, sp.x, sp.y, outer, inner, sp.rot)
        ctx.fillStyle = `rgba(${r},${g},${b},1)`
        ctx.fill()

        /* soft glow */
        const glow = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, outer * 2.6)
        glow.addColorStop(0, `rgba(${r},${g},${b},0.28)`)
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, outer * 2.6, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        ctx.restore()
      }

      animId = requestAnimationFrame(drawFrame)
    }

    const stopLoop = () => {
      cancelAnimationFrame(animId)
    }

    const startIfAllowed = () => {
      stopLoop()
      resize()
      if (reducedMotionMq.matches) {
        ctx.clearRect(0, 0, W, H)
        return
      }
      animId = requestAnimationFrame(drawFrame)
    }

    startIfAllowed()
    const ro = new ResizeObserver(() => startIfAllowed())
    ro.observe(canvas)
    const onMq = () => startIfAllowed()
    if (typeof reducedMotionMq.addEventListener === 'function') {
      reducedMotionMq.addEventListener('change', onMq)
    } else {
      reducedMotionMq.addListener(onMq)
    }

    return () => {
      cancelAnimationFrame(animId)
      if (typeof reducedMotionMq.removeEventListener === 'function') {
        reducedMotionMq.removeEventListener('change', onMq)
      } else {
        reducedMotionMq.removeListener(onMq)
      }
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    />
  )
}
