import { useRef } from "react"
import { SphereGeometry, MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"

import { station } from "../../state"

const geometry = new SphereGeometry(1, 32, 32)
station.Hud.Interstake.body.material.set(new MeshStandardMaterial({ roughness: 0.2, metalness: 1, color: 0x0b9898 }))

export default function Interstake({ position, scale }) {
  const material = station.Hud.Interstake.body.material.use()

  const group = useRef()
  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.5
  })

  return (
    <group position={position} scale={scale}>
      <mesh geometry={geometry}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial transparent={true} roughness={0.4} metalness={1} opacity={0.2} color={0x0b9898} />
      </mesh>
      <group ref={group}>
        <mesh geometry={geometry} material={material} position={[0, 0, 0]} scale={0.5} />
        <mesh geometry={geometry} material={material} position={[0.75, 0, 0]} scale={0.15} />
        <mesh geometry={geometry} material={material} position={[-0.75, 0, 0]} scale={0.15} />
      </group>
    </group>
  )
}
