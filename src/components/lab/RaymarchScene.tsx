/** @jsxImportSource react */
import * as React from 'react'
import { useThree } from '@react-three/fiber'
import {
	CanvasTexture
} from 'three';
import { 
  float, vec2, vec3,
  sin, max, min, abs, mix, dot, reflect,
  Fn, Loop, If, Break,
  timerLocal,
  uv, viewportResolution,
  add, sub, normalize
} from 'three/tsl';
import { MeshBasicNodeMaterial, WebGPURenderer, QuadMesh } from 'three/webgpu';

/* 1. Define shape functions (SDF) */
const sdSphere = Fn(([p, r]) => {
  // distance from point p to surface of sphere with radius r
  return p.length().sub(r)
})

/* 2. Smooth minimum for gloopier merges */
const smin = Fn(([a, b, k]) => {
  const h = max(k.sub(abs(a.sub(b))), float(0)).div(k)
  return min(a, b).sub(h.mul(h).mul(k).mul(0.25))
})

/* 3. Scene definition SDF function */
const sdf = Fn(([pos]) => {
  const t = timerLocal(1)
  const movingPos = pos.add(vec3(sin(t), 0, 0))
  const sphereA = sdSphere(movingPos, 0.5)
  const sphereB = sdSphere(pos, 0.3)
  return smin(sphereA, sphereB, 0.3)
})

/* 4. Calculate normals by sampling around the SDF */
const calcNormal = Fn(([p]) => {
  const eps = float(0.0001)
  const h = vec2(eps, 0)
  
  // Create sample points using built-in swizzling
  const px = add(p, h.xyy)
  const mx = sub(p, h.xyy)
  const py = add(p, h.yxy)
  const my = sub(p, h.yxy)
  const pz = add(p, h.yyx)
  const mz = sub(p, h.yyx)
  
  // Calculate gradients using composition
  const dx = sub(sdf(px), sdf(mx))
  const dy = sub(sdf(py), sdf(my))
  const dz = sub(sdf(pz), sdf(mz))
  
  return normalize(vec3(dx, dy, dz))
})

/* 5. Lighting function */
const lighting = Fn(([rayOrigin, hitPos]) => {
  const normal = calcNormal(hitPos)
  const viewDir = rayOrigin.sub(hitPos).normalize()

  // Ambient
  const ambient = vec3(0.2)

  // Directional light
  const lightDir = vec3(1, 1, 1).normalize()
  const lightColor = vec3(1, 1, 0.9)
  const dp = max(float(0), dot(lightDir, normal))
  const diffuse = dp.mul(lightColor)

  // Hemisphere
  const skyColor = vec3(0, 0.3, 0.6)
  const groundColor = vec3(0.6, 0.3, 0.1)
  const hemiMix = normal.y.mul(0.5).add(0.5)
  const hemi = mix(groundColor, skyColor, hemiMix)

  // Specular (simple Phong)
  const reflectDir = reflect(lightDir.negate(), normal).normalize()
  const specPower = max(float(0), dot(viewDir, reflectDir)).pow(32)
  const specular = vec3(specPower)

  // Fresnel
  const fresnel = float(1).sub(max(float(0), dot(viewDir, normal))).pow(2)
  specular.mulAssign(fresnel)

  // Combine lighting
  const baseLight = ambient.mul(0.1)
    .add(diffuse.mul(0.5))
    .add(hemi.mul(0.2))

  // Base color
  const baseColor = vec3(0.1).mul(baseLight)
  baseColor.addAssign(specular)

  return baseColor
})

/* 6. Raymarch loop */
const raymarch = Fn(() => {
  // transform uv to normalized device coords
  const _uv = uv().mul(viewportResolution.xy).mul(2)
    .sub(viewportResolution.xy)
    .div(viewportResolution.y)

  const rayOrigin = vec3(0, 0, -3)
  const rayDirection = vec3(_uv, 1).normalize()

  // track distance traveled
  const t = float(0).toVar()
  const rayPos = rayOrigin.add(rayDirection.mul(t)).toVar()

  // loop stepping through the scene
  Loop(80, () => {
    const d = sdf(rayPos)
    t.addAssign(d)
    rayPos.assign(rayOrigin.add(rayDirection.mul(t)))

    // break if close enough
    If(d.lessThan(0.001), () => Break())

    // break if too far
    If(t.greaterThan(100), () => Break())
  })

  // compute lighting if we hit, else fall back color
  return lighting(rayOrigin, rayPos)
})()

/* 7. Create and configure the NodeMaterial */
const raymarchMaterial = new MeshBasicNodeMaterial()
raymarchMaterial.colorNode = raymarch

/**
 * Renders a fullscreen plane that uses a raymarching NodeMaterial.
 */
export function RaymarchScene() {
  const { width, height } = useThree((s) => s.viewport)
  return (
    <mesh scale={[width, height, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={raymarchMaterial} attach="material" />
    </mesh>
  )
} 