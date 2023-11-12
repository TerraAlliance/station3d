import { useRef } from "react"
import { MeshStandardMaterial, Shape } from "three"
import { useFrame } from "@react-three/fiber"
import { Extrude } from "@react-three/drei"

import { station } from "../../state"

const y = 0.55
const x = 0.72

const arcShape = new Shape()
arcShape.moveTo(0, y)
arcShape.bezierCurveTo(x, y - 0.1, x, -(y - 0.1), 0, -y)
arcShape.bezierCurveTo(0, -y, 0, -(y - 0.1), 0, -(y - 0.1))
arcShape.bezierCurveTo(x - 0.15, -(y - 0.2), x - 0.15, y - 0.2, 0, y - 0.1)

station.Hud.Usdc.body.material.set(new MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: "white" }))

export default function Usdc({ position, scale }) {
  const material = station.Hud.Usdc.body.material.use()

  const d = useRef()
  useFrame((state, delta) => {
    d.current.rotation.y += delta * 0.5
  })
  const cylinder = useRef()
  useFrame((state) => {
    cylinder.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3
  })

  return (
    <group position={position} scale={scale}>
      <group ref={d}>
        <Extrude position={[0, 0, -0.05]} args={[arcShape, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]} material={material} />
        <mesh position={[-0.4, 0, 0]} material={material}>
          <boxGeometry args={[0.1, 1.1, 0.1]} />
        </mesh>
        <mesh position={[-0.2, 0.5, 0]} material={material}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
        </mesh>
        <mesh position={[-0.2, -0.5, 0]} material={material}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
        </mesh>
      </group>
      <group ref={cylinder}>
        <mesh position={[0, 0.13, 0]} rotation={[0.1, 0, 0]} material={material}>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 32, 1, false]} />
        </mesh>
        <mesh position={[0, -0.13, 0]} rotation={[0.1, 0, 0]} material={material}>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 32, 1, false]} />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial transparent={true} roughness={0.4} metalness={1} opacity={0.5} color={0xf5af3d} />
      </mesh>
    </group>
  )
}
