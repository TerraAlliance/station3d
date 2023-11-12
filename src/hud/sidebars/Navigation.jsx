import { useState, lazy, Suspense } from "react"
import { useWindowSize } from "@uidotdev/usehooks"
import useSound from "use-sound"

const Satellite = lazy(() => import("../objects/Satellite"))
const Button = lazy(() => import("../gui/Button"))
import sound from "/sounds/sound_4.mp3"
import { station } from "../../state"

const pages = ["Home", "Swap", "Wallet", "Stake", "Burn", "Govern", "Feed", "Theme"]

export default function Navigation() {
  const touch = "ontouchstart" in document.documentElement
  const [page, setPage] = useState(0)
  const size = useWindowSize()
  const x = size.width / 2 - 150

  const [play] = useSound(sound, { volume: station.volume.use() })

  return (
    <>
      {!touch && (
        <>
          <Suspense>
            <Satellite position={[x, 400, 0]} rotation={[0, 0, (7 / 4) * Math.PI]} scale={3} />
          </Suspense>
          <Suspense>
            <Button text="Home" position={[x, 180, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Home"), play())} />
            <Button text="Wallet" position={[x, 120, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Wallet"), play())} />
            <Button text="Swap" position={[x, 60, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Swap"), play())} />
            <Button text="Stake" position={[x, 0, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Stake"), play())} />
            <Button text="Burn" position={[x, -60, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Burn"), play())} />
            <Button text="Govern" position={[x, -120, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Govern"), play())} />
            <Button text="Theme" position={[x, -180, 0]} scale={35} width={140} onClick={() => (station.Hud.event.set("Theme"), play())} />
          </Suspense>
        </>
      )}
      {touch && (
        <>
          <Arrow
            position={[-100, -size.height / 2 + 60, 0]}
            scale={500}
            rotation={90}
            onClick={() => {
              station.Hud.event.set(pages.at((page - 1) % pages.length))
              setPage((page - 1) % pages.length)
            }}
          />
          <Arrow
            position={[100, -size.height / 2 + 60, 0]}
            scale={500}
            rotation={270}
            onClick={() => {
              station.Hud.event.set(pages.at((page + 1) % pages.length))
              setPage((page + 1) % pages.length)
            }}
          />
        </>
      )}
    </>
  )
}

function Arrow({ position, scale, rotation, onClick }) {
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
