import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function CentralObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
      meshRef.current.rotation.x += delta * 0.05
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.08
      wireRef.current.rotation.z += delta * 0.06
    }
  })

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.15, 2]} />
          <MeshDistortMaterial
            color="#8a6cff"
            emissive="#241a44"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.4}
            distort={0.32}
            speed={1.6}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.55}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#fab044" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
      <pointLight color="#8a6cff" intensity={18} distance={6} position={[0, 0, 0]} />
    </group>
  )
}

function ParticleField({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [count])

  const ref = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#c3b3ff"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  )
}

function GridFloor() {
  return <gridHelper args={[30, 30, '#392a5e', '#170f22']} position={[0, -2.4, 0]} />
}

function CameraRig() {
  const target = useRef(new THREE.Vector3())

  useFrame((state) => {
    target.current.set(state.pointer.x * 0.7, state.pointer.y * 0.4, 0)
    state.camera.position.x += (target.current.x - state.camera.position.x) * 0.04
    state.camera.position.y += (target.current.y - state.camera.position.y) * 0.04
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

function SceneContents({ particleCount }: { particleCount: number }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 4, 4]} intensity={0.7} color="#efe9ff" />
      <CentralObject />
      <ParticleField count={particleCount} />
      <GridFloor />
      <CameraRig />
      <fog attach="fog" args={['#060609', 6, 13]} />
    </>
  )
}

export function HeroScene({ particleCount = 900 }: { particleCount?: number }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <SceneContents particleCount={particleCount} />
    </Canvas>
  )
}
