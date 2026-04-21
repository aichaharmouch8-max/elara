import { motion } from 'framer-motion'

const AnimatedBottle = ({ dim = false }) => (
  <div style={{
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
  }}>
    {/* Glow halo */}
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '340px', height: '340px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,150,42,0.26) 0%, rgba(232,184,75,0.09) 48%, transparent 72%)',
        }}
      />
    </div>

    {/* Floating bottle */}
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, -1, 0, 1, 0] }}
      transition={{
        y:      { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        filter: dim
          ? 'blur(6px)'
          : 'drop-shadow(0 28px 52px rgba(200,150,42,0.55)) drop-shadow(0 8px 22px rgba(28,21,16,0.25))',
        opacity: dim ? 0.08 : 1,
        position: 'relative', zIndex: 1,
        transition: 'opacity 0.3s',
        background: 'none',
        border: 'none',
        lineHeight: 0,
      }}
    >
      <img
        src="/bottle.png"
        alt="ELARA Reine"
        style={{
          height: '400px',
          width: 'auto',
          display: 'block',
          background: 'transparent',
          border: 'none',
          mixBlendMode: 'multiply',
          filter: 'contrast(1.15) sepia(12%) saturate(125%) brightness(1.1)',
        }}
      />
    </motion.div>
  </div>
)

export default AnimatedBottle
