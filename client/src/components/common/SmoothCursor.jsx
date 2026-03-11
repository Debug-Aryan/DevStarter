import { useEffect, useRef } from "react"
import { motion, useSpring } from "framer-motion"

const isTouchOrCoarsePointerDevice = () => {
  if (typeof window === "undefined") return true
  if ("ontouchstart" in window) return true
  return !!window.matchMedia?.("(pointer: coarse)")?.matches
}

const DefaultCursorSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      className="scale-50"
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="white"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="black"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

function SmoothCursorDesktop({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}) {
  // NOTE: Some ESLint configs don't count `<motion.div>` as a usage of `motion`.
  // Referencing it in JS keeps lint happy and is equivalent at runtime.
  const MotionDiv = motion.div

  const targetPos = useRef({ x: 0, y: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastUpdateTime = useRef(0)
  const hasInitRef = useRef(false)
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)
  const rafIdRef = useRef(null)
  const idleTimerRef = useRef(null)

  // Use transform-based motion values for better perf than left/top.
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  })

  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  })

  useEffect(() => {
    const now = performance.now()
    lastUpdateTime.current = now

    const updateFromTarget = () => {
      rafIdRef.current = null

      const currentTime = performance.now()
      const deltaTime = currentTime - lastUpdateTime.current

      // Clamp huge gaps (tab switch / idle) to avoid sudden rotation jumps.
      const dt = Math.min(Math.max(deltaTime, 1), 50)

      const currentPos = { x: targetPos.current.x, y: targetPos.current.y }
      velocity.current = {
        x: (currentPos.x - lastMousePos.current.x) / dt,
        y: (currentPos.y - lastMousePos.current.y) / dt,
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos

      const speed = Math.hypot(velocity.current.x, velocity.current.y)

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.08) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360

        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        scale.set(0.95)
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        idleTimerRef.current = setTimeout(() => {
          scale.set(1)
          idleTimerRef.current = null
        }, 150)
      }
    }

    const onPointerMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY }

      // Initialize on first move to avoid a big first-frame velocity/jump.
      if (!hasInitRef.current) {
        hasInitRef.current = true
        lastMousePos.current = targetPos.current
        lastUpdateTime.current = performance.now()
        cursorX.set(targetPos.current.x)
        cursorY.set(targetPos.current.y)
      }

      if (rafIdRef.current != null) return
      rafIdRef.current = requestAnimationFrame(updateFromTarget)
    }

    document.documentElement.style.cursor = "none"

    window.addEventListener("pointermove", onPointerMove, { passive: true })

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.style.cursor = ""
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [cursorX, cursorY, rotation, scale])

  return (
    <MotionDiv
      style={{
        x: cursorX,
        y: cursorY,
      }}
      className="fixed left-0 top-0 z-[100] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
      aria-hidden="true"
    >
      <MotionDiv
        style={{
          rotate: rotation,
          scale,
        }}
        className="will-change-transform"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        {cursor}
      </MotionDiv>
    </MotionDiv>
  )
}

export function SmoothCursor(props) {
  if (isTouchOrCoarsePointerDevice()) return null
  return <SmoothCursorDesktop {...props} />
}

export default SmoothCursor
