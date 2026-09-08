import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 2500

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uVelocity;

  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aInitPos;

  varying float vOpacity;

  void main() {
    vec3 pos = aInitPos;

    // Organic noise drift
    pos.x += sin(pos.y * 0.5 + uTime * 0.28 + aPhase) * 0.3;
    pos.y += cos(pos.x * 0.4 + uTime * 0.21 + aPhase * 1.3) * 0.28;
    pos.z += sin(pos.z * 0.35 + uTime * 0.19 + aPhase * 0.8) * 0.22;

    // Cursor repulsion
    float d = distance(pos.xy, uMouse * 5.5);
    float repel = smoothstep(2.0, 0.0, d) * uVelocity;
    vec2 dir = normalize(pos.xy - uMouse * 5.5 + vec2(0.0001));
    pos.xy += dir * repel * 1.6;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (260.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;

    vOpacity = smoothstep(0.1, 1.0, (pos.z + 3.5) / 7.0) * 0.6 + 0.1;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vOpacity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * vOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function ParticleField() {
  const { pointer } = useThree()
  const meshRef = useRef<THREE.Points>(null)
  const prevPtr = useRef({ x: 0, y: 0 })
  const velRef = useRef(0)

  const { geometry, uniforms } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.5 + Math.random() * 3.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7
      sizes[i] = Math.random() * 2.0 + 0.4
      phases[i] = Math.random() * Math.PI * 2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aInitPos', new THREE.BufferAttribute(pos.slice(), 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: 0 },
      uColor: { value: new THREE.Color('#D4FF00') },
    }

    return { geometry, uniforms }
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial

    const dx = pointer.x - prevPtr.current.x
    const dy = pointer.y - prevPtr.current.y
    const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    velRef.current += (Math.min(speed, 55) - velRef.current) * 0.1
    prevPtr.current = { x: pointer.x, y: pointer.y }

    mat.uniforms.uTime.value += delta
    mat.uniforms.uMouse.value.set(pointer.x, pointer.y)
    mat.uniforms.uVelocity.value = velRef.current

    meshRef.current.rotation.y += delta * 0.016
    meshRef.current.rotation.x += delta * 0.008
  })

  return (
    <points ref={meshRef}>
      <primitive object={geometry} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function ShockwaveRing({ onFire }: { onFire?: () => void }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const progress = useRef(0)
  const active = useRef(false)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (!ringRef.current || !active.current) return
    progress.current += delta * 2.0
    const scale = progress.current * 5
    ringRef.current.scale.set(scale, scale, 1)
    const mat = ringRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, 1 - progress.current)
    if (progress.current >= 1) {
      active.current = false
      progress.current = 0
      ringRef.current.scale.set(0.001, 0.001, 1)
    }
  })

  const handleClick = useCallback(() => {
    if (!ringRef.current) return
    active.current = true
    progress.current = 0
    ringRef.current.position.set(pointer.x * 5.5, pointer.y * 5.5, 0)
    onFire?.()
  }, [pointer, onFire])

  return (
    <mesh ref={ringRef} scale={[0.001, 0.001, 1]} onClick={handleClick}>
      <ringGeometry args={[0.7, 1, 64]} />
      <meshBasicMaterial color="#D4FF00" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

interface HeroCanvasProps {
  onShockwave?: () => void
}

export default function HeroCanvas({ onShockwave }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 58 }}
      dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <ParticleField />
      <ShockwaveRing onFire={onShockwave} />
    </Canvas>
  )
}
