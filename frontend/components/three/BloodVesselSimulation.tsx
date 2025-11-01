'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface BloodVesselSimulationProps {
  isHypertension?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function BloodVesselSimulation({ 
  isHypertension = true, 
  width = 800, 
  height = 500,
  className = ""
}: BloodVesselSimulationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number>(0);
  const vesselRef = useRef<THREE.Mesh | null>(null);
  const bloodCellsRef = useRef<THREE.Mesh[]>([]);
  const clockRef = useRef(new THREE.Clock());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 100);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 35);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI;
    controls.minDistance = 20;
    controls.maxDistance = 60;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Additional rim lighting
    const rimLight = new THREE.DirectionalLight(0x4080ff, 0.3);
    rimLight.position.set(-10, -10, -5);
    scene.add(rimLight);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Create blood vessel and cells
    createBloodVessel(scene, isHypertension);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      updateBloodCells(delta, isHypertension);
      updateVessel(isHypertension);
      
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Update renderer size
      const newWidth = document.fullscreenElement ? window.innerWidth : width;
      const newHeight = document.fullscreenElement ? window.innerHeight : height;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Handle window resize
    const handleResize = () => {
      if (!document.fullscreenElement && mountRef.current) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [width, height]);

  // Update simulation when isHypertension changes
  useEffect(() => {
    if (sceneRef.current) {
      updateVesselAppearance(isHypertension);
    }
  }, [isHypertension]);

  const createBloodVessel = (scene: THREE.Scene, hypertension: boolean) => {
    // Remove existing vessel and cells
    if (vesselRef.current) {
      scene.remove(vesselRef.current);
      vesselRef.current.geometry.dispose();
      (vesselRef.current.material as THREE.Material).dispose();
    }

    bloodCellsRef.current.forEach(cell => {
      scene.remove(cell);
      cell.geometry.dispose();
      (cell.material as THREE.Material).dispose();
    });
    bloodCellsRef.current = [];

    // Blood vessel parameters
    const vesselLength = 50;
    const vesselRadius = hypertension ? 6 : 10;

    // Create vessel geometry (cylinder)
    const vesselGeometry = new THREE.CylinderGeometry(
      vesselRadius, 
      vesselRadius * 0.8, 
      vesselLength, 
      64, 
      1, 
      true
    );

    // Create vessel material
    const vesselMaterial = new THREE.MeshPhongMaterial({
      color: hypertension ? 0xff2020 : 0x2080ff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      emissive: hypertension ? 0x440000 : 0x001144,
      emissiveIntensity: 0.2
    });

    // Create vessel mesh
    const vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
    vessel.rotation.z = Math.PI / 2;
    vessel.position.set(0, 0, 0);
    vessel.castShadow = true;
    vessel.receiveShadow = true;
    scene.add(vessel);
    vesselRef.current = vessel;

    // Create blood cells
    createBloodCells(scene, vesselLength, vesselRadius, hypertension);

    // Add particle effects for turbulence
    if (hypertension) {
      createTurbulenceParticles(scene);
    }
  };

  const createBloodCells = (scene: THREE.Scene, vesselLength: number, vesselRadius: number, hypertension: boolean) => {
    const bloodCells: THREE.Mesh[] = [];
    const cellCount = hypertension ? 80 : 50;

    // Blood cell geometry - more detailed
    const cellGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    
    for (let i = 0; i < cellCount; i++) {
      // Different cell types with varying sizes and colors
      const cellType = Math.random();
      let cellMaterial: THREE.MeshPhongMaterial;
      let cellScale = 1;

      if (cellType < 0.7) {
        // Red blood cells
        cellMaterial = new THREE.MeshPhongMaterial({
          color: 0xff4444,
          shininess: 30,
          emissive: 0x110000,
          emissiveIntensity: 0.1
        });
        cellScale = 0.8;
      } else if (cellType < 0.9) {
        // White blood cells
        cellMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          shininess: 50,
          emissive: 0x111111,
          emissiveIntensity: 0.05
        });
        cellScale = 1.2;
      } else {
        // Platelets
        cellMaterial = new THREE.MeshPhongMaterial({
          color: 0xffaa44,
          shininess: 80,
          emissive: 0x221100,
          emissiveIntensity: 0.1
        });
        cellScale = 0.4;
      }

      const cell = new THREE.Mesh(cellGeometry, cellMaterial);
      cell.scale.setScalar(cellScale);
      cell.castShadow = true;

      // Position cells randomly within the vessel
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (vesselRadius * 0.85);
      
      cell.position.x = Math.random() * vesselLength - vesselLength / 2;
      cell.position.y = Math.cos(angle) * radius;
      cell.position.z = Math.sin(angle) * radius;

      // Add velocity and turbulence data
      const baseSpeed = hypertension ? 6 : 3;
      const speedVariation = hypertension ? 4 : 1;
      
      cell.userData = {
        velocity: new THREE.Vector3(
          baseSpeed + Math.random() * speedVariation,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ),
        turbulence: hypertension ? Math.random() * 0.8 + 0.2 : 0.1,
        originalRadius: radius,
        cellType: cellType < 0.7 ? 'red' : cellType < 0.9 ? 'white' : 'platelet'
      };

      scene.add(cell);
      bloodCells.push(cell);
    }

    bloodCellsRef.current = bloodCells;
  };

  const createTurbulenceParticles = (scene: THREE.Scene) => {
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 60;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.3,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
  };

  const updateBloodCells = (delta: number, hypertension: boolean) => {
    if (!vesselRef.current) return;

    const vesselLength = 50;
    const vesselRadius = hypertension ? 6 : 10;
    
    bloodCellsRef.current.forEach(cell => {
      // Update position
      cell.position.x += cell.userData.velocity.x * delta;
      cell.position.y += cell.userData.velocity.y * delta;
      cell.position.z += cell.userData.velocity.z * delta;

      // Add turbulence
      if (hypertension) {
        const turbulence = cell.userData.turbulence * delta;
        cell.position.y += (Math.random() - 0.5) * turbulence * 2;
        cell.position.z += (Math.random() - 0.5) * turbulence * 2;
      }

      // Wrap around if outside vessel length
      if (cell.position.x > vesselLength / 2) {
        cell.position.x = -vesselLength / 2;
        
        // Randomize position slightly
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (vesselRadius * 0.85);
        cell.position.y = Math.cos(angle) * radius;
        cell.position.z = Math.sin(angle) * radius;
      }

      // Keep cells inside vessel with collision detection
      const currentRadius = Math.sqrt(cell.position.y ** 2 + cell.position.z ** 2);
      const maxRadius = vesselRadius * 0.9;
      
      if (currentRadius > maxRadius) {
        const factor = maxRadius / currentRadius;
        cell.position.y *= factor;
        cell.position.z *= factor;
        
        // Bounce effect for hypertension
        if (hypertension) {
          cell.userData.velocity.y *= -0.3;
          cell.userData.velocity.z *= -0.3;
          
          // Add some randomness to avoid stuck cells
          cell.userData.velocity.y += (Math.random() - 0.5) * 0.5;
          cell.userData.velocity.z += (Math.random() - 0.5) * 0.5;
        }
      }

      // Add slight rotation for visual interest
      cell.rotation.x += delta * (cell.userData.velocity.x * 0.1);
      cell.rotation.y += delta * (cell.userData.velocity.y * 0.2);
      cell.rotation.z += delta * (cell.userData.velocity.z * 0.15);
    });
  };

  const updateVessel = (hypertension: boolean) => {
    if (!vesselRef.current) return;

    const vessel = vesselRef.current;
    const targetRadius = hypertension ? 6 : 10;
    const currentScale = vessel.scale.x;
    const targetScale = targetRadius / 10; // 10 is the base radius

    // Animate vessel size change
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.02);
    vessel.scale.x = newScale;
    vessel.scale.z = newScale;

    // Update vessel color
    const targetColor = hypertension ? new THREE.Color(0xff2020) : new THREE.Color(0x2080ff);
    const currentColor = (vessel.material as THREE.MeshPhongMaterial).color;
    currentColor.lerp(targetColor, 0.02);

    // Update emissive color
    const targetEmissive = hypertension ? new THREE.Color(0x440000) : new THREE.Color(0x001144);
    const currentEmissive = (vessel.material as THREE.MeshPhongMaterial).emissive;
    currentEmissive.lerp(targetEmissive, 0.02);
  };

  const updateVesselAppearance = (hypertension: boolean) => {
    if (!sceneRef.current) return;
    
    // Recreate the vessel with new parameters
    createBloodVessel(sceneRef.current, hypertension);
  };

  const toggleFullscreen = async () => {
    if (!mountRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await mountRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mountRef} 
        className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-2xl"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      
      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
        title="Toggle Fullscreen"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isFullscreen ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
            />
          )}
        </svg>
      </button>

      {/* Controls info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/60 backdrop-blur-sm text-white text-xs p-3 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div>🖱️ <strong>Rotate:</strong> Click + Drag</div>
            <div>🔍 <strong>Zoom:</strong> Mouse Wheel</div>
            <div>🎯 <strong>Focus:</strong> Double Click</div>
          </div>
        </div>
      </div>
    </div>
  );
}