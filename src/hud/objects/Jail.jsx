import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshStandardMaterial, CylinderGeometry } from "three"

const material = new MeshStandardMaterial({ roughness: 0.2, metalness: 1, coloe: "grey" })
const geometry = new CylinderGeometry(2, 2, 100)

export default function Jail({ position, scale }) {
  const group = useRef()
  useFrame((state, delta) => {
    group.current.rotation.y -= delta * 0.5
    group.current.rotation.z -= delta * 0.5
    group.current.rotation.x -= delta * 0.5
  })

  return (
    <>
      <group ref={group} position={position} scale={scale || 0.9} rotation={[0.2, 0, 0]}>
        <group>
          <Bars rotation={[0, 0, 0]} />
          <Bars rotation={[0, 0, Math.PI / 2]} />
        </group>
        <group rotation={[0, Math.PI / 2, 0]}>
          <Bars rotation={[0, 0, 0]} />
          <Bars rotation={[0, 0, Math.PI / 2]} />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <Bars rotation={[0, 0, 0]} />
          <Bars rotation={[0, 0, Math.PI / 2]} />
        </group>
      </group>
    </>
  )
}

function Bars({ rotation }) {
  return (
    <group rotation={rotation}>
      <mesh geometry={geometry} material={material} position={[-0, 0, 50]} />
      <mesh geometry={geometry} material={material} position={[50, 0, 50]} />
      <mesh geometry={geometry} material={material} position={[-50, 0, -50]} />
      <mesh geometry={geometry} material={material} position={[-0, 0, -50]} />
    </group>
  )
}
