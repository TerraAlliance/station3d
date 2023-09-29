import { useRef, useState } from "react"
import { SphereGeometry, MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"
import { useSpringValue, animated } from "@react-spring/three"

import { station } from "../../state"

const geometry = new SphereGeometry(1, 32, 32)
station.Hud.Orion.body.material.set(new MeshStandardMaterial({ roughness: 0.2, metalness: 1, color: 0x08c176 }))

export default function Orion({ position, scale, onClick }) {
  const material = station.Hud.Orion.body.material.use()

  const [hovered, setHover] = useState(false)
  const explode = useSpringValue(0.75, { config: { mass: 1, friction: 15, tension: 350, clamp: true } })

  const group = useRef()
  useFrame((state, delta) => {
    group.current.rotation.z += delta * 0.5
  })

  return (
    <group position={position} scale={scale}>
      <group ref={group}>
        <animated.mesh geometry={geometry} material={material} position={explode.to((v) => [v, 0, 0])} scale={0.15} />
        <animated.mesh geometry={geometry} material={material} position={explode.to((v) => [-v, 0, 0])} scale={0.15} />
      </group>
      <mesh geometry={geometry} material={material} position={[0, 0, 0]} scale={0.5} />
      <mesh
        geometry={geometry}
        onPointerOver={() => {
          setHover(true)
          explode.start(1)
        }}
        onPointerOut={() => {
          setHover(false)
          explode.start(0.75)
        }}
        onClick={() => {
          explode
            .start(2)
            .then(() => explode.start(0.75))
            .then(() => onClick())
        }}
      >
        <meshStandardMaterial transparent={true} roughness={1} metalness={1} opacity={hovered ? 0 : 0.1} color={0x0b9898} />
      </mesh>
    </group>
  )
}
