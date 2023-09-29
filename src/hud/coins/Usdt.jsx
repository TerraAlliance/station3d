import { useRef } from "react"
import { MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"

import { station } from "../../state"

station.Hud.Usdt.body.material.set(new MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: "white" }))

export default function Usdt({ position, scale }) {
  const material = station.Hud.Usdt.body.material.use()

  const t = useRef()
  const cylinder = useRef()

  useFrame((state, delta) => {
    t.current.rotation.y += delta * 0.5
  })
  useFrame((state) => {
    cylinder.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3
  })

  return (
    <group position={position} scale={scale}>
      <group ref={t}>
        <mesh material={material}>
          <boxGeometry args={[0.25, 1, 0.25]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={material}>
          <boxGeometry args={[0.9, 0.25, 0.25]} />
        </mesh>
      </group>
      <mesh ref={cylinder} position={[0, 0, 0]} rotation={[0.1, 0, 0]} material={material}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 32, 1, false]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial transparent={true} roughness={0.4} metalness={1} opacity={0.5} color={0x0b9898} />
      </mesh>
    </group>
  )
}
