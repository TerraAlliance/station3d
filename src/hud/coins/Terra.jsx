import { useRef, useState, Suspense } from "react"
import { SphereGeometry, MeshStandardMaterial } from "three"
import { useGLTF, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useSpringValue, animated } from "@react-spring/three"
import { station } from "../../state"
import useSound from "use-sound"

import sound from "/sounds/sound_13.mp3"

station.Hud.Terra.material.set(new MeshStandardMaterial({ roughness: 0.25, metalness: 1, color: 0x0063ff }))

const sphere = new SphereGeometry(1, 32, 32)
const flags = ["us", "tw", "th", "sg", "se", "imf", "ph", "sj", "my", "mn", "kr", "jp", "in", "id", "hk", "sh", "eu", "dk", "cn", "ch", "ca", "au"]

export default function Terra({ position, material: _material, scale, onClick, animate, flag, setFlag }) {
  const [hovered, setHover] = useState(false)
  const { nodes } = useGLTF("/terra.glb")
  const explode = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 350, clamp: true } })
  const material = station.Hud.Terra.material.use()

  const [rotation, setRotation] = useState(0)
  const flagRotation = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 150, clamp: false } })

  const [play] = useSound(sound, { volume: station.volume.use() })

  const group = useRef()
  useFrame((state, delta) => (group.current.rotation.y += delta * 0.5))

  return (
    <group position={position}>
      <group ref={group} rotation={[0, -Math.PI / 2, Math.PI / 2]}>
        <animated.mesh material={_material || material} position={explode.to((v) => [-v, 0, -v])} scale={scale} geometry={nodes.Sphere.geometry}></animated.mesh>
        <animated.mesh material={_material || material} position={explode.to((v) => [-v, 0, v])} scale={scale} geometry={nodes.Sphere1.geometry}></animated.mesh>
        <animated.mesh material={_material || material} position={explode.to((v) => [v, 0, -v])} scale={scale} geometry={nodes.Sphere2.geometry}></animated.mesh>
        <animated.mesh material={_material || material} position={explode.to((v) => [v, 0, v])} scale={scale} geometry={nodes.Sphere3.geometry}></animated.mesh>
      </group>
      <animated.mesh
        geometry={sphere}
        scale={scale}
        onPointerOver={() => {
          setHover(true)
          animate && explode.start(scale / 3)
        }}
        onPointerOut={() => {
          setHover(false)
          animate && explode.start(0)
        }}
        onClick={() => {
          animate &&
            explode
              .start(scale * 2.5)
              .then(() => explode.start(0))
              .then(() => onClick && onClick())
        }}
        rotation={[0, 0, Math.PI / 2]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial transparent={true} opacity={0.5} color={hovered && animate ? "blue" : "darkblue"} />
      </animated.mesh>
      {flag !== undefined && (
        <>
          <Suspense>
            <Flag scale={scale} flag={flag} flagRotation={flagRotation} />
          </Suspense>
          {setFlag && (
            <>
              <Arrow
                position={[-Math.max(scale * 0.3, 16), -scale / 1.5, 150]}
                scale={Math.max(scale * 1.2, 100)}
                rotation={90}
                onClick={() => {
                  play()
                  flagRotation.start(rotation - 2)
                  setRotation((prev) => prev - 2)
                  setTimeout(() => {
                    setFlag((flag) => (flag - 1) % flags.length)
                  }, 100)
                }}
              />
              <Arrow
                position={[Math.max(scale * 1.3, 45), -scale / 1.5, 150]}
                scale={Math.max(scale * 1.2, 100)}
                rotation={270}
                onClick={() => {
                  play()
                  flagRotation.start(rotation + 2)
                  setRotation((prev) => prev + 2)
                  setTimeout(() => {
                    setFlag((flag) => (flag - 1) % flags.length)
                  }, 100)
                }}
              />
            </>
          )}
        </>
      )}
    </group>
  )
}

export function Flag({ scale, flag, flagRotation }) {
  const texture = useTexture({ map: "flags/" + flags.at(flag) + ".svg" })
  const widthSegments = 30

  const mesh = useRef()
  useFrame((state) => {
    const vertex = mesh.current.geometry.attributes.position.array
    for (let y = 0; y < vertex.length; y += 3) {
      for (let x = 0; x < vertex.length; x += 3) {
        const index = x + y * (widthSegments + 1)
        const time = state.clock.elapsedTime * 10
        vertex[index + 2] = (Math.sin(0.2 * x + 0 * y - time) * 0.2 * x) / 4
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <animated.group rotation={flagRotation.to((v) => [0, Math.PI * v, 0])}>
      <mesh ref={mesh} rotation={[20 * (Math.PI / 180), 0, 0]} position={[scale / 2, -scale / 1.5, scale]} scale={scale / 60}>
        <planeGeometry args={[75, 50, widthSegments]} />
        <meshBasicMaterial {...texture} />
      </mesh>
    </animated.group>
  )
}

export function Arrow({ position, scale, rotation, onClick }) {
  const [hovered, setHover] = useState(false)
  return (
    <group position={position}>
      <mesh rotation={[0, 0, rotation * (Math.PI / 180)]} scale={scale / 50}>
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} />
        <coneGeometry args={[2.5, 8]} />
      </mesh>
      <mesh rotation={[0, 0, 90 * (Math.PI / 180)]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={onClick}>
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} transparent={true} opacity={hovered ? 0.15 : 0.25} />
        <capsuleGeometry args={[scale / 12, scale / 12]} />
      </mesh>
    </group>
  )
}
