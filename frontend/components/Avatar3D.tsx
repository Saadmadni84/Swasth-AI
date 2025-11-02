'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text3D, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface Avatar3DProps {
  isSpeaking?: boolean
  onLoaded?: () => void
}

function AvatarModel({ isSpeaking = false, onLoaded }: Avatar3DProps) {
  const { scene, animations } = useGLTF('https://models.readyplayer.me/6906482aefedb00e4537b79e.glb')
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Object3D | null>(null)
  const jawRef = useRef<THREE.Object3D | null>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const hasLoaded = useRef(false)
  const lipSyncPhase = useRef(0)
  const breathingPhase = useRef(0)
  const bodyRef = useRef<THREE.Object3D | null>(null)

  // Find head, jaw, and body bones for animations
  useEffect(() => {
    if (scene) {
      console.log('🔍 Searching for avatar bones...')
      scene.traverse((child) => {
        const name = child.name.toLowerCase()
        
        // Find head bone
        if (!headRef.current && (
          name.includes('head') || 
          name.includes('neck') ||
          name === 'head' ||
          child.type === 'Bone' && name.includes('mixamorig:head')
        )) {
          headRef.current = child
          console.log('✅ Found head bone:', child.name)
        }
        
        // Find jaw bone
        if (!jawRef.current && (
          name.includes('jaw') || 
          name.includes('chin') ||
          name.includes('mouth') ||
          name === 'jaw' ||
          child.type === 'Bone' && name.includes('mixamorig:jaw')
        )) {
          jawRef.current = child
          console.log('✅ Found jaw bone:', child.name)
        }
        
        // Find spine/body for breathing
        if (!bodyRef.current && (
          name.includes('spine') || 
          name.includes('chest') ||
          name === 'spine' ||
          child.type === 'Bone' && name.includes('mixamorig:spine')
        )) {
          bodyRef.current = child
          console.log('✅ Found body bone:', child.name)
        }
      })
      
      // Log all bones if we didn't find what we need
      if (!headRef.current || !jawRef.current) {
        console.log('⚠️ Could not find all bones. Available bones:')
        scene.traverse((child) => {
          if (child.type === 'Bone' || child.type === 'SkinnedMesh') {
            console.log('  - ', child.name, '(', child.type, ')')
          }
        })
      }
    }
  }, [scene])

  useEffect(() => {
    if (scene && animations && !hasLoaded.current) {
      hasLoaded.current = true
      const mixer = new THREE.AnimationMixer(scene)
      mixerRef.current = mixer

      // Play idle animation by default
      if (animations.length > 0) {
        const idleAction = mixer.clipAction(animations[0])
        idleAction.play()
        setCurrentAction('idle')
      }

      // Notify parent that model is loaded
      if (onLoaded) {
        onLoaded()
      }
    }
  }, [scene, animations, onLoaded])

  useEffect(() => {
    if (mixerRef.current && animations && animations.length > 0) {
      // Switch to speaking animation if available
      if (isSpeaking) {
        // Try to find a talking/speaking animation, otherwise use first animation
        const speakingAnim = animations.find(anim => 
          anim.name.toLowerCase().includes('talk') || 
          anim.name.toLowerCase().includes('speak') ||
          anim.name.toLowerCase().includes('happy')
        ) || animations[0]
        
        const action = mixerRef.current.clipAction(speakingAnim)
        action.reset().setLoop(THREE.LoopRepeat, Infinity).play()
        setCurrentAction('speaking')
      } else {
        // Return to idle
        const idleAction = mixerRef.current.clipAction(animations[0])
        idleAction.reset().setLoop(THREE.LoopRepeat, Infinity).play()
        setCurrentAction('idle')
      }
    }
  }, [isSpeaking, animations])

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
    
    // Always animate the whole avatar group for visible movement
    if (groupRef.current) {
      breathingPhase.current += delta * 2
      
      // More pronounced breathing effect - gentle up and down
      const breathingY = Math.sin(breathingPhase.current) * 0.08
      groupRef.current.position.y = breathingY
      
      // More visible swaying motion
      const swayX = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      const swayZ = Math.cos(state.clock.elapsedTime * 0.3) * 0.03
      groupRef.current.rotation.x = swayX
      groupRef.current.rotation.z = swayZ
      
      // Add gentle rotation
      const rotation = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
      groupRef.current.rotation.y = rotation
    }
    
    // Enhanced lip syncing and head movement when speaking
    if (isSpeaking) {
      lipSyncPhase.current += delta * 20
      
      // Animate the whole avatar group more dramatically when speaking
      if (groupRef.current) {
        // More pronounced bobbing when speaking
        const speakingBob = Math.sin(lipSyncPhase.current * 0.5) * 0.12
        groupRef.current.position.y += speakingBob
        
        // Add side-to-side movement
        const headShake = Math.sin(lipSyncPhase.current * 0.3) * 0.08
        groupRef.current.rotation.y += headShake
      }
      
      // Try to animate jaw if found
      if (jawRef.current) {
        // More pronounced lip movement
        const lipMovement = Math.abs(Math.sin(lipSyncPhase.current)) * 
                           (0.3 + Math.sin(lipSyncPhase.current * 2.3) * 0.2)
        
        jawRef.current.rotation.x = lipMovement
      }
      
      // Animate head if found
      if (headRef.current) {
        const headBob = Math.sin(lipSyncPhase.current * 0.8) * 0.1
        const headTurn = Math.sin(lipSyncPhase.current * 0.4) * 0.15
        
        headRef.current.rotation.x = headBob
        headRef.current.rotation.y = headTurn
      }
      
      // Animate body/spine if found
      if (bodyRef.current) {
        const bodyMove = Math.sin(lipSyncPhase.current * 0.6) * 0.08
        bodyRef.current.rotation.z = bodyMove
      }
    } else {
      // Reset animations smoothly when not speaking
      if (jawRef.current) {
        jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, delta * 4)
      }
      
      if (headRef.current && !isSpeaking) {
        // Gentle idle head movement
        const idleHeadTurn = Math.sin(state.clock.elapsedTime * 0.4) * 0.12
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, idleHeadTurn, delta * 2)
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, delta * 2)
      }
      
      if (bodyRef.current) {
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, delta * 3)
      }
    }
  })

  // Scale and position the model in center
  useEffect(() => {
    if (scene) {
      scene.scale.setScalar(1.2)
      scene.position.set(0, -1.5, 0)
    }
  }, [scene])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function AvatarScene({ isSpeaking, onLoaded }: Avatar3DProps) {
  return (
    <>
      {/* Camera positioned to center the avatar */}
      <PerspectiveCamera makeDefault position={[0, 0.5, 2.5]} fov={45} />
      
      {/* Lighting setup for better visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />
      <pointLight position={[0, 3, 2]} intensity={0.8} />
      <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
      
      {/* Avatar Model */}
      <Suspense fallback={null}>
        <AvatarModel isSpeaking={isSpeaking} onLoaded={onLoaded} />
      </Suspense>
      
      {/* Orbit controls for user interaction */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={4}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
      
      {/* Ground plane with shadow */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  )
}

export default function Avatar3D({ isSpeaking = false, onLoaded }: Avatar3DProps) {
  const [loaded, setLoaded] = useState(false)
  const [testSpeaking, setTestSpeaking] = useState(false)

  const handleLoaded = () => {
    setLoaded(true)
    if (onLoaded) {
      onLoaded()
    }
  }
  
  // Combine prop and test state for speaking
  const isCurrentlySpeaking = isSpeaking || testSpeaking

  return (
    <div className="w-full h-full relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">Loading avatar...</p>
          </div>
        </div>
      )}
      
      {/* Test Speaking Button */}
      {loaded && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setTestSpeaking(!testSpeaking)}
            className={`px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 ${
              testSpeaking 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            }`}
          >
            <span className="text-sm">{testSpeaking ? '🔴 Stop Test' : '▶️ Test Speaking'}</span>
          </button>
        </div>
      )}
      
      {/* Speaking indicator overlay */}
      {isCurrentlySpeaking && loaded && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-blue-300 animate-pulse">
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '100ms' }}></div>
            <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '200ms' }}></div>
            <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-sound-wave" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-xs font-semibold text-blue-700">Speaking</span>
        </div>
      )}
      
      <Canvas
        className={`w-full h-full rounded-2xl transition-all duration-300 ${
          isCurrentlySpeaking ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #EBF4FF 0%, #E0E7FF 100%)'
        }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={() => handleLoaded()}
      >
        <AvatarScene isSpeaking={isCurrentlySpeaking} onLoaded={handleLoaded} />
      </Canvas>
      
      {/* Idle state indicator */}
      {!isCurrentlySpeaking && loaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-600">💭 Idle - Use test button or voice to see animation</span>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes sound-wave {
          0%, 100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }
        
        .animate-sound-wave {
          animation: sound-wave 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}


