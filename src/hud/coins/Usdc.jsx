import { useRef } from "react"
import { MeshStandardMaterial, Shape } from "three"
import { useFrame } from "@react-three/fiber"
import { Extrude } from "@react-three/drei"

import { station } from "../../state"

const sShape = new Shape()
sShape.moveTo(0.25, 0.2)
sShape.bezierCurveTo(0.25, 0.2, 0.25, 0.4, 0, 0.4)
sShape.bezierCurveTo(-0.35, 0.4, -0.35, -0.05, 0, -0.05)
sShape.bezierCurveTo(0.2, -0.05, 0.2, -0.3, 0, -0.3)
sShape.bezierCurveTo(-0.15, -0.3, -0.15, -0.2, -0.15, -0.2)
sShape.bezierCurveTo(-0.15, -0.2, -0.25, -0.2, -0.25, -0.2)
sShape.bezierCurveTo(-0.25, -0.2, -0.25, -0.4, 0, -0.4)
sShape.bezierCurveTo(0.35, -0.4, 0.35, 0.05, 0, 0.05)
sShape.bezierCurveTo(-0.2, 0.05, -0.2, 0.3, 0, 0.3)
sShape.bezierCurveTo(0.15, 0.3, 0.15, 0.2, 0.15, 0.2)

const arcShape = new Shape()
arcShape.moveTo(0.2, 0.75)
arcShape.bezierCurveTo(1, 0.6, 1, -0.6, 0.2, -0.75)
arcShape.bezierCurveTo(0.2, -0.75, 0.2, -0.65, 0.2, -0.65)
arcShape.bezierCurveTo(0.85, -0.5, 0.85, 0.5, 0.2, 0.65)

station.Hud.Usdc.body.material.set(new MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: "white" }))

export default function Usdc({ position, scale }) {
  const material = station.Hud.Usdc.body.material.use()

  const mesh1 = useRef()
  const mesh2 = useRef()

  useFrame((state, delta) => {
    mesh1.current.rotation.y += delta * 0.5
  })
  useFrame((state, delta) => {
    mesh2.current.rotation.x += delta * 0.5
  })

  return (
    <group position={position} scale={scale}>
      <group ref={mesh1}>
        <mesh position={[0, 0.45, 0]} material={material}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
        </mesh>
        <mesh position={[0, -0.45, 0]} material={material}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
        </mesh>
        <Extrude position={[0, 0, -0.05]} args={[sShape, { curveSegments: 24, steps: 1, depth: 0.1, bevelEnabled: false }]} material={material} />
      </group>

      <group ref={mesh2}>
        <Extrude position={[0, 0, -0.05]} args={[arcShape, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]} material={material} />
        <Extrude position={[0, 0, 0.05]} rotation={[0, Math.PI, 0]} args={[arcShape, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]} material={material} />
      </group>

      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial transparent={true} roughness={0.4} metalness={1} opacity={0.5} color={0x2671c4} />
      </mesh>
    </group>
  )
}
