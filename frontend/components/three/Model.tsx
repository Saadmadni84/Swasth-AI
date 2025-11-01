'use client'

import React, { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshProps } from '@react-three/fiber'

export function FallbackBox(props: MeshProps) {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4f46e5" />
    </mesh>
  )
}

export function Model({ url, ...props }: { url?: string } & MeshProps) {
  // If no URL provided, render fallback
  if (!url) return <FallbackBox {...props} />

  try {
    // This hook will throw if the model fails, caught by Suspense boundaries
    const gltf = useGLTF(url)
    return <primitive object={gltf.scene} {...props} />
  } catch (e) {
    return <FallbackBox {...props} />
  }
}

// Drei recommendation to pre-process GLTFs
useGLTF.preload('/models/your-model.glb')