import { useState } from "react"
import { useSpringValue, animated } from "@react-spring/three"
import { useConnectedWallet } from "@terra-money/wallet-kit"
import useSound from "use-sound"

import { station } from "../../state"

import AnimatedPage from "../gui/AnimatedPage"
import Button from "../gui/Button"
import sound_1 from "/sounds/sound_11.mp3"
import sound_2 from "/sounds/sound_13.mp3"

import Lunc from "../coins/Lunc"
import Terra from "../coins/Terra"
import Luna from "../coins/Luna"
import Usdc from "../coins/Usdc"

export default function Swap() {
  return <AnimatedPage name="Swap">{station.Hud.Swap.active.use() && <Page />}</AnimatedPage>
}

function Page() {
  const [swapped, setSwapped] = useState(false)
  const rotation = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 150 } })
  const tornado = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 50 } })
  const connected = useConnectedWallet()

  const [play_1] = useSound(sound_1, { volume: station.volume.use() })
  const [play_2] = useSound(sound_2, { volume: station.volume.use() })

  return (
    <>
      <animated.group rotation={rotation.to((v) => [0, v, 0])}>
        <animated.group rotation={tornado.to((v) => [0, v, 0])}>
          {
            {
              mainnet: <Main />,
              testnet: <Main />,
              classic: <Classic spring={rotation} />,
              localterra: <Main />,
            }[connected?.network || "mainnet"]
          }
          <Revert
            onClick={() => {
              if (swapped) setSwapped(false), rotation.start(0), play_2()
              else setSwapped(true), rotation.start(Math.PI), play_2()
            }}
          />
        </animated.group>
      </animated.group>
      <Button text="Swap" position={[0, -200, 0]} scale={35} onClick={() => (tornado.start(Math.PI * 10), tornado.reset(), play_1())} />
    </>
  )
}

function Main() {
  return (
    <>
      <Luna position={[-200, 0, 0]} scale={130} />
      <Usdc position={[200, 0, 0]} scale={130} />
    </>
  )
}

function Classic({ spring }) {
  const [activeFlag, setActiveFlag] = useState(0)
  return (
    <>
      <Lunc position={[-200, 0, 0]} scale={130} />
      <animated.group position={[200, 0, 0]} rotation={spring.to((v) => [0, v, 0])}>
        <Terra scale={130} flag={activeFlag} setFlag={setActiveFlag} />
      </animated.group>
    </>
  )
}

function Revert({ position, rotation, onClick }) {
  const [hovered, setHover] = useState(false)
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={onClick}>
        <capsuleGeometry args={[15, 70]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} transparent={true} opacity={hovered ? 0.15 : 0.25} />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <capsuleGeometry args={[1, 60]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
      <mesh position={[0, -5, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <capsuleGeometry args={[1, 60]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
      <mesh position={[-30, 5, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <coneGeometry args={[6, 30]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
      <mesh position={[30, -5, 0]} rotation={[0, 0, 270 * (Math.PI / 180)]}>
        <coneGeometry args={[6, 30]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
    </group>
  )
}
