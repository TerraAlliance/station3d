import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { MeshStandardMaterial } from "three"

const material = new MeshStandardMaterial({ roughness: 0.1, metalness: 1, color: 0xfcba03 })

export default function Wallet3d({ position, onClick, scale }) {
  const wallet = useRef()
  useFrame((state, delta) => {
    wallet.current.rotation.y -= delta * 0.5
  })

  return (
    <>
      <group ref={wallet} onClick={onClick} position={position} scale={scale}>
        <mesh material={material} position={[8, 0, 4]} scale={[2, 2, 0.5]} arg={[1, 32, 16]}>
          <sphereGeometry args={[1, 8, 8]} />
        </mesh>
        <RoundedBox position={[6, 0, 3]} args={[10, 5, 1]} radius={0.4}>
          <meshStandardMaterial roughness={0.1} metalness={1} color={0x5494f8} />
        </RoundedBox>
        <RoundedBox material={material} args={[20, 20, 5]} radius={2}></RoundedBox>
      </group>
    </>
  )
}
