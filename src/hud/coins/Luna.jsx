import { SphereGeometry, MeshStandardMaterial } from "three"

import FireSphere from "./FireSphere"

const geometry = new SphereGeometry(1, 32, 32)
const material = new MeshStandardMaterial({ roughness: 0.25, metalness: 1, color: 0xfcba03 })

export default function Luna({ position, scale }) {
  return (
    <group position={position} rotation={[0, Math.PI, Math.PI / 4]}>
      <FireSphere position={[0, 0, 0]} scale={[scale * 1.001, scale * 1.001, scale * 1.001]} />
      <mesh geometry={geometry} material={material} scale={scale} />
    </group>
  )
}
