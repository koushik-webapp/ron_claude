'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// ─── Junk item shape catalogue ────────────────────────────────────────────────
type JunkDef = { w: number; h: number; d: number; shape: 'box' | 'cyl' }
const JUNK_DEFS: JunkDef[] = [
  { w: 1.6, h: 0.55, d: 0.75, shape: 'box' },  // couch
  { w: 0.65, h: 1.4, d: 0.55, shape: 'box' },  // fridge
  { w: 0.85, h: 0.85, d: 0.85, shape: 'box' },  // large box
  { w: 0.5,  h: 0.5,  d: 0.5,  shape: 'box' },  // small box
  { w: 1.8,  h: 0.13, d: 1.2,  shape: 'box' },  // mattress
  { w: 0.65, h: 0.85, d: 0.65, shape: 'cyl' },  // washer / drum
  { w: 1.1,  h: 0.65, d: 0.08, shape: 'box' },  // TV flat panel
  { w: 1.2,  h: 0.08, d: 0.75, shape: 'box' },  // table top
  { w: 0.55, h: 1.1,  d: 0.55, shape: 'box' },  // wardrobe
  { w: 0.7,  h: 0.75, d: 0.7,  shape: 'box' },  // microwave
]

// Muted dark-metallic palette so items read against dark bg
const PALETTE = [
  '#3b3552', '#2b4258', '#5c3e2c', '#2c5240', '#52292c',
  '#2c3f52', '#3f522c', '#52472c', '#2c4452', '#3d2c52',
]

const ITEM_COUNT = 30

// ─── Per-item data (computed once) ────────────────────────────────────────────
type ItemData = {
  id: number
  def: JunkDef
  color: string
  // vortex params
  spiralAngle: number   // initial angle in spiral
  radius: number        // initial radius from axis
  yOffset: number       // vertical offset
  angularSpeed: number  // how fast it orbits
  inwardSpeed: number   // how fast it moves to center
  selfSpin: THREE.Vector3
  phase: number
}

function buildItems(): ItemData[] {
  return Array.from({ length: ITEM_COUNT }, (_, i) => {
    const t = i / ITEM_COUNT
    return {
      id: i,
      def: JUNK_DEFS[i % JUNK_DEFS.length],
      color: PALETTE[i % PALETTE.length],
      spiralAngle: t * Math.PI * 6,          // 3 full loops spread across
      radius: 3.5 + t * 5.0,                 // outer items start farther away
      yOffset: (Math.random() - 0.5) * 5.5,
      angularSpeed: 0.22 + Math.random() * 0.22,
      inwardSpeed: 0.06 + Math.random() * 0.08,
      selfSpin: new THREE.Vector3(
        (Math.random() - 0.5) * 0.022,
        (Math.random() - 0.5) * 0.028,
        (Math.random() - 0.5) * 0.016,
      ),
      phase: Math.random() * Math.PI * 2,
    }
  })
}

// ─── Single junk object ───────────────────────────────────────────────────────
function JunkItem({ data }: { data: ItemData }) {
  const ref = useRef<THREE.Mesh>(null!)
  const { def, color, id, spiralAngle, radius, yOffset, angularSpeed, inwardSpeed, selfSpin, phase } = data

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // Progress loops 0→1 repeatedly, offset per item so all positions are filled
    const progress = ((t * inwardSpeed + (id / ITEM_COUNT)) % 1.0)
    const r = (1 - progress) * radius + 0.4
    const angle = spiralAngle + t * angularSpeed
    const y = yOffset * (1 - progress * 0.75) + Math.sin(t * 0.4 + phase) * 0.15

    ref.current.position.set(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r * 0.55,   // flatten Z slightly to create depth
    )

    ref.current.rotation.x += selfSpin.x
    ref.current.rotation.y += selfSpin.y
    ref.current.rotation.z += selfSpin.z

    // Scale down as they approach center (sucked in effect)
    const s = 0.2 + (1 - progress) * 0.8
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref} castShadow>
      {def.shape === 'cyl'
        ? <cylinderGeometry args={[def.w / 2, def.w / 2, def.h, 16]} />
        : <boxGeometry args={[def.w, def.h, def.d]} />
      }
      <meshStandardMaterial
        color={color}
        metalness={0.45}
        roughness={0.6}
        emissive={color}
        emissiveIntensity={0.18}
      />
    </mesh>
  )
}

// ─── Truck ────────────────────────────────────────────────────────────────────
function Truck() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.07
    groupRef.current.position.y = -1.4 + Math.sin(t * 0.45) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, -1.4, -1.5]} scale={1.35}>
      {/* ── Cargo box ── */}
      <mesh position={[0.35, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.45, 1.25]} />
        <meshStandardMaterial color="#0d1117" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Cargo door seam */}
      <mesh position={[1.52, 0.1, 0]}>
        <boxGeometry args={[0.04, 1.3, 1.1]} />
        <meshStandardMaterial color="#1d2b3a" metalness={0.9} roughness={0.2} emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>

      {/* ── Cab ── */}
      <mesh position={[-1.3, -0.18, 0]} castShadow>
        <boxGeometry args={[0.85, 1.05, 1.25]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Windshield */}
      <mesh position={[-1.72, 0.12, 0]}>
        <boxGeometry args={[0.04, 0.52, 0.95]} />
        <meshStandardMaterial color="#1e40af" metalness={0.95} roughness={0.05} transparent opacity={0.65} />
      </mesh>

      {/* Headlights */}
      {([-0.38, 0.38] as number[]).map((z, i) => (
        <mesh key={i} position={[-1.73, -0.12, z]}>
          <boxGeometry args={[0.04, 0.18, 0.18]} />
          <meshStandardMaterial color="#fff" emissive="#93c5fd" emissiveIntensity={2.5} />
        </mesh>
      ))}

      {/* Company name panel */}
      <mesh position={[0.35, 0.42, 0.635]}>
        <boxGeometry args={[1.6, 0.35, 0.01]} />
        <meshStandardMaterial color="#0d1117" emissive="#3b82f6" emissiveIntensity={0.45} />
      </mesh>

      {/* ── Wheels ── */}
      {([
        [-0.8,  -0.62,  0.68],
        [-0.8,  -0.62, -0.68],
        [ 0.75, -0.62,  0.68],
        [ 0.75, -0.62, -0.68],
        [-1.25, -0.62,  0.58],
        [-1.25, -0.62, -0.58],
      ] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.29, 0.29, 0.18, 20]} />
          <meshStandardMaterial color="#080808" metalness={0.35} roughness={0.85} />
        </mesh>
      ))}

      {/* Ground shadow plane */}
      <mesh position={[0, -0.92, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#000" transparent opacity={0} />
      </mesh>
    </group>
  )
}

// ─── Vortex energy ring ───────────────────────────────────────────────────────
function VortexRings() {
  const rings = useMemo(() => [
    { radius: 2.0, y: 0,    speed: 0.4,  color: '#1d4ed8' },
    { radius: 3.8, y: 0.5,  speed: -0.3, color: '#1e3a5f' },
    { radius: 5.5, y: -0.4, speed: 0.2,  color: '#1e293b' },
  ], [])

  return (
    <>
      {rings.map((r, i) => (
        <VortexRing key={i} {...r} />
      ))}
    </>
  )
}

function VortexRing({ radius, y, speed, color }: { radius: number; y: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.elapsedTime * speed
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.2
  })

  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.025, 8, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.5} />
    </mesh>
  )
}

// ─── Full scene ───────────────────────────────────────────────────────────────
function Scene() {
  const items = useMemo(() => buildItems(), [])

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.15} />

      {/* Key – cool blue from top-right */}
      <pointLight position={[6, 9, 3]}   intensity={120} color="#4da6ff" castShadow shadow-mapSize={[1024, 1024]} />

      {/* Rim – warm from rear-left */}
      <pointLight position={[-6, 4, -4]} intensity={55}  color="#ff6820" />

      {/* Under-glow */}
      <pointLight position={[0, -5, 0]}  intensity={30}  color="#1a40a0" />

      {/* Vortex core glow */}
      <pointLight position={[0, 0, -1]}  intensity={50}  color="#60aaff" />

      {/* Truck headlights */}
      <spotLight
        position={[-3, -1.2, -2.5]}
        target-position={[-8, -1.2, -2.5]}
        angle={0.35}
        penumbra={0.6}
        intensity={40}
        color="#93c5fd"
      />

      {/* Fog */}
      <fog attach="fog" args={['#060610', 9, 25]} />

      {/* Sparkles (dust particles) */}
      <Sparkles count={140} scale={14} size={1.2} speed={0.25} color="#4da6ff" opacity={0.35} />

      {/* Vortex rings */}
      <VortexRings />

      {/* Junk items */}
      {items.map((item) => (
        <JunkItem key={item.id} data={item} />
      ))}

      {/* Truck */}
      <Truck />
    </>
  )
}

// ─── Exported canvas wrapper ──────────────────────────────────────────────────
export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 11], fov: 52, near: 0.1, far: 60 }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, toneMappingExposure: 1.3 }}
      style={{ background: '#060610' }}
    >
      <Scene />
    </Canvas>
  )
}
