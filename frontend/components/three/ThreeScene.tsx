'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Model } from './Model'

export default function ThreeScene({ modelUrl }: { modelUrl?: string }) {
  return (
    <div style={{ width: '100%', height: '480px' }}>
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Model url={modelUrl} position={[0, 0.5, 0]} />
        </Suspense>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  )
}