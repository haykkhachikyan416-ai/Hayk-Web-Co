import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/*
 * A field of electric-blue points that swells and settles like a live signal,
 * and ripples outward from the pointer. Raw WebGL rather than three.js: it is
 * one full-screen fragment shader, and a 3D engine would add ~150 KB for a
 * flat effect.
 *
 * Built to fail quietly. No WebGL (or jsdom, which has none) shows a static
 * CSS dot pattern instead; reduced motion draws a single still frame; the loop
 * stops whenever the canvas is off screen or the tab is hidden, and a lost GPU
 * context falls back to the CSS pattern rather than leaving a black box.
 */

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAGMENT = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uIntensity;
uniform float uCell;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float noise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cellId = floor(frag / uCell);
  vec2 local = fract(frag / uCell) - 0.5;
  vec2 centre = (cellId + 0.5) * uCell;
  vec2 uv = centre / uResolution.y;

  float t = uTime;
  float slow = noise(uv * 1.35 + vec2(t * 0.045, -t * 0.03));
  float fast = noise(uv * 3.2 + vec2(-t * 0.08, t * 0.06));
  // A slow diagonal band sweeping across, so the field reads as a signal
  // travelling somewhere rather than random static.
  float band = sin((uv.x * 1.4 - uv.y * 0.8) * 3.1 - t * 0.55) * 0.5 + 0.5;
  float energy = smoothstep(0.05, 0.95, slow * 0.55 + fast * 0.2 + band * 0.45);

  float d = distance(centre, uPointer) / uResolution.y;
  float ripple = exp(-d * 5.5) * (0.65 + 0.35 * sin(d * 46.0 - t * 4.0));
  energy = clamp(energy + ripple * uPointerStrength, 0.0, 1.0);

  float radius = mix(0.07, 0.34, energy);
  float dotMask = 1.0 - smoothstep(radius - 0.07, radius, length(local));

  vec3 blue = vec3(0.192, 0.361, 1.0);
  vec3 colour = mix(blue * 0.45, blue, energy);
  colour = mix(colour, vec3(0.86, 0.9, 1.0), smoothstep(0.86, 1.0, energy));

  vec2 q = frag / uResolution;
  // Fade toward the top-left, where the headline sits, and toward the edges.
  float fade = smoothstep(0.0, 0.55, q.x * 0.75 + (1.0 - q.y) * 0.45);
  fade *= smoothstep(0.0, 0.12, q.y) * smoothstep(1.0, 0.86, q.y);

  float alpha = dotMask * (0.1 + 0.9 * energy) * fade * uIntensity;
  gl_FragColor = vec4(colour * alpha, alpha);
}
`

type SignalFieldProps = {
  className?: string
  /** 0–1 overall brightness, so a second field can sit quieter. */
  intensity?: number
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function SignalField({ className, intensity = 1 }: SignalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState<'pending' | 'live' | 'fallback'>('pending')

  useEffect(() => {
    const canvas = canvasRef.current
    // jsdom and very old browsers have no WebGL at all. Checking for the
    // constructor first avoids jsdom's noisy "not implemented" getContext.
    if (!canvas || typeof WebGLRenderingContext === 'undefined') {
      setMode('fallback')
      return
    }
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    })
    if (!gl) {
      setMode('fallback')
      return
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) {
      setMode('fallback')
      return
    }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setMode('fallback')
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uResolution = uniform('uResolution')
    const uTime = uniform('uTime')
    const uPointer = uniform('uPointer')
    const uPointerStrength = uniform('uPointerStrength')
    const uIntensity = uniform('uIntensity')
    const uCell = uniform('uCell')

    // Soft dots do not need retina pixels; capping the scale keeps the
    // fragment cost flat on large, dense displays.
    const scale = Math.min(window.devicePixelRatio || 1, 1.25)
    let width = 0
    let height = 0
    const resize = () => {
      const box = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(box.width * scale))
      height = Math.max(1, Math.round(box.height * scale))
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }
    resize()

    const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, strength: 0, target: 0 }
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const handlePointer = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom
      pointer.target = inside ? 1 : 0
      pointer.targetX = (event.clientX - box.left) * scale
      // WebGL's origin is bottom-left.
      pointer.targetY = (box.bottom - event.clientY) * scale
      if (pointer.x < -999) {
        pointer.x = pointer.targetX
        pointer.y = pointer.targetY
      }
    }

    let frame = 0
    let running = false
    let visible = true
    let lastDraw = 0
    const start = performance.now()
    // Phones and touch devices get 30 fps. The field drifts slowly enough
    // that the difference is invisible, and it halves the GPU and battery
    // cost on the hardware least able to spare it.
    const frameBudget = window.matchMedia('(max-width: 899px), (pointer: coarse)').matches
      ? 1000 / 30
      : 0

    const draw = (now: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.08
      pointer.y += (pointer.targetY - pointer.y) * 0.08
      pointer.strength += (pointer.target - pointer.strength) * 0.05
      gl.uniform2f(uResolution, width, height)
      gl.uniform1f(uTime, reduceMotion ? 12 : (now - start) / 1000)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.uniform1f(uPointerStrength, pointer.strength)
      gl.uniform1f(uIntensity, intensity)
      gl.uniform1f(uCell, Math.round(15 * scale))
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      if (now - lastDraw >= frameBudget - 1) {
        lastDraw = now
        draw(now)
      }
      frame = requestAnimationFrame(loop)
    }
    const play = () => {
      if (running || reduceMotion || !visible || document.hidden) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    draw(start)
    setMode('live')

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = Boolean(entry?.isIntersecting)
            if (visible) play()
            else pause()
          })
    observer?.observe(canvas)
    const handleVisibility = () => (document.hidden ? pause() : play())
    const handleResize = () => {
      resize()
      if (!running) draw(performance.now())
    }
    const handleLost = (event: Event) => {
      event.preventDefault()
      pause()
      setMode('fallback')
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('webglcontextlost', handleLost)
    if (finePointer && !reduceMotion) {
      window.addEventListener('pointermove', handlePointer, { passive: true })
    }
    play()

    return () => {
      pause()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointer)
      canvas.removeEventListener('webglcontextlost', handleLost)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.deleteBuffer(buffer)
    }
  }, [intensity, reduceMotion])

  return (
    <div className={`signal-field${className ? ` ${className}` : ''}`} data-mode={mode}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
