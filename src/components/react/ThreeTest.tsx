import { Canvas, CanvasProps } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { AdaptiveDpr } from '@react-three/drei'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'

const ThreeTest = () => {
  return (
    <div>
      <Canvas>
        <AdaptiveDpr pixelated />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  )
}

export default ThreeTest 