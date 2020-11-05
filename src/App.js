import React, { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas, useLoader, useThree, useFrame } from 'react-three-fiber'
import { CubeTextureLoader } from 'three'
import { OrbitControls, Loader } from 'drei'
import './App.css'

function SkyBox() {
  const { scene } = useThree()
  const [texture] = useLoader(CubeTextureLoader, [
    [
      './textures/bkg1_right.png',
      './textures/bkg1_left.png',
      './textures/bkg1_top.png',
      './textures/bkg1_bot.png',
      './textures/bkg1_front.png',
      './textures/bkg1_back.png',
    ],
  ])
  useLayoutEffect(() => {
    const oldBg = scene.background
    const oldEnv = scene.environment
    scene.background = texture
    scene.environment = texture
    // Clean up on unmount
    return () => {
      scene.background = oldBg
      scene.environment = oldEnv
      texture.dispose()
    }
  }, [scene, texture])
  return null
}
function Sphere() {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereBufferGeometry args={[2, 32, 32]} />
      <meshStandardMaterial roughness={0} metalness={1} />
    </mesh>
  )
}
function SmallSphere({ position }) {
  const mesh = useRef()
  useFrame(() => (mesh.current.rotation.x += 0.008))
  return (
    <group ref={mesh}>
      <mesh position={position} rotation={[0, 0, 0]} scale={[0.2, 0.2, 0.2]}>
        <sphereBufferGeometry args={[2, 32, 32]} />
        <meshStandardMaterial roughness={0.1} metalness={1} />
      </mesh>
    </group>
  )
}
// function Dolly() {
//   // This one makes the camera move in and out
//   useFrame(({ clock, camera }) =>
//     camera.updateProjectionMatrix(
//       void (camera.rotation.z = 5 + Math.sin(clock.getElapsedTime()) * 3)
//     )
//   )
//   return null
// }

export default function App() {
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.3} />
        <OrbitControls autoRotate={true} />
        <Sphere />
        <SmallSphere position={[4, 0, 0]} />
        <SmallSphere position={[0, 0, 4]} />
        <Suspense fallback={null}>
          <SkyBox />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}
