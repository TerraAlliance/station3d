import { useRef } from "react"
import { SphereGeometry, CylinderGeometry, MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"

const sphere = new SphereGeometry(1, 32, 32)
const cylinder = new CylinderGeometry(0.3, 0.3, 5)
const material = new MeshStandardMaterial({ color: "purple", transparent: true, opacity: 0.1 })
const material2 = new MeshStandardMaterial({ roughness: 0.25, metalness: 1, color: "purple" })

export default function Ibc({ position, scale }) {
  const group = useRef()
  useFrame((state, delta) => {
    // group.current.rotation.y += delta * 0.5
    group.current.rotation.z += delta * 0.5
  })

  return (
    <group position={position} scale={scale}>
      <mesh geometry={sphere} material={material} />
      <group ref={group}>
        <group rotation={[0, 0, Math.PI / 3]}>
          <mesh position={[0, -0.6, 0]} geometry={sphere} material={material2} scale={0.25} />
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} geometry={cylinder} material={material2} scale={0.25} />
        </group>
        <group rotation={[0, 0, -Math.PI / 3]}>
          <mesh position={[0, -0.6, 0]} geometry={sphere} material={material2} scale={0.25} />
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} geometry={cylinder} material={material2} scale={0.25} />
        </group>
        <group rotation={[0, 0, Math.PI / 1]}>
          <mesh position={[0, -0.6, 0]} geometry={sphere} material={material2} scale={0.25} />
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} geometry={cylinder} material={material2} scale={0.25} />  
        </group>
      </group>
    </group>
  )
}
