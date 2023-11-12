import { useRef, useState, useEffect } from "react"
import { SphereGeometry, MeshStandardMaterial } from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { useFrame } from "@react-three/fiber"
import { useSpringValue, animated } from "@react-spring/three"

const halfsphere = new SphereGeometry(1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2)
const roundedbox = new RoundedBoxGeometry(14, 20, 2, 20, 1)
const white = new MeshStandardMaterial({ roughness: 0.2, metalness: 1, side: 2 })
const blue = new MeshStandardMaterial({ roughness: 0.2, metalness: 1, color: 0x5494f8 })

export default function Satellite({ position, rotation, scale, startAnimation = 0, onClick }) {
  const [hovered, setHover] = useState(false)
  const explode = useSpringValue(14, { config: { mass: 1, friction: 15, tension: 350, clamp: true } })
  const satellite = useRef()
  useEffect(() => {
    satellite.current.rotation.y -= startAnimation
  }, [])
  useFrame((state, delta) => {
    satellite.current.rotation.y -= delta * 0.5
  })

  return (
    <>
      <group position={position} rotation={rotation} scale={scale}>
        <group ref={satellite}>
          <mesh geometry={roundedbox} material={white} />
          <animated.mesh geometry={roundedbox} material={blue} position={explode.to((v) => [v, 0, 0])} scale={[0.85, 0.4, 0.5]} />
          <animated.mesh geometry={roundedbox} material={blue} position={explode.to((v) => [-v, 0, 0])} scale={[0.85, 0.4, 0.5]} />
          <animated.mesh geometry={halfsphere} material={white} position={explode.to((v) => [0, -v - 2, 0])} scale={[6, 6, 6]} />
        </group>
      </group>
      {onClick && (
        <mesh
          position={position}
          scale={scale * 22.5}
          onPointerOver={() => {
            setHover(true)
            explode.start(20)
          }}
          onPointerOut={() => {
            setHover(false)
            explode.start(14)
          }}
          onClick={() => {
            explode
              .start(35)
              .then(() => explode.start(14))
              .then(() => onClick())
          }}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={"white"} transparent={true} opacity={hovered ? 0 : 0.1} />
        </mesh>
      )}
    </>
  )
}
