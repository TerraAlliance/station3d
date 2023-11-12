import { useRef } from "react"
import { MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"

import { station } from "../../state"

station.Hud.Lunc.body.material.set(new MeshStandardMaterial({ roughness: 0.27, metalness: 1, color: 0xfcba03 }))

export default function Lunc({ position, scale }) {
  const material = station.Hud.Lunc.body.material.use()
  const { nodes } = useGLTF("/lunc.glb")

  const mesh = useRef()
  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.5
  })

  return (
    <group position={position} scale={scale}>
      <pointLight decay={0} distance={scale * 1.5} intensity={500} position={[0, 0, 0]} />
      <group ref={mesh} rotation={[0, -Math.PI / 2, Math.PI / 2]}>
        <mesh material={material} geometry={nodes.Sphere.geometry} />
        <mesh material={material} geometry={nodes.Sphere1.geometry} />
      </group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial transparent={true} opacity={0.5} color={"darkorange"} />
      </mesh>
    </group>
  )
}
