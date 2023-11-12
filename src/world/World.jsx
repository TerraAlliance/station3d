import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"

export default function World() {
  return (
    <>
      <Starfield />
    </>
  )
}

function Starfield() {
  const stars = useRef()
  useFrame((state, delta) => (stars.current.rotation.z -= delta * 0.01))

  return (
    <>
      <Stars ref={stars} radius={100} depth={50} count={5000} factor={2} saturation={0} speed={1} />
    </>
  )
}
