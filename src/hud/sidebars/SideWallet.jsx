import { useState, lazy, Suspense } from "react"
import { useWindowSize } from "@uidotdev/usehooks"
import { Html } from "@react-three/drei"
import { useWallet, useConnectedWallet } from "@terra-money/wallet-kit"
import useSound from "use-sound"

import AnimatedText from "../gui/AnimatedText"
const Wallet3d = lazy(() => import("../objects/Wallet3d"))
const Button = lazy(() => import("../gui/Button"))
import Lunc from "../coins/Lunc"
import Luna from "../coins/Luna"
import Terra from "../coins/Terra"
import Usdc from "../coins/Usdc"
import Usdt from "../coins/Usdt"
import Dai from "../coins/Dai"
import { station } from "../../state"
import sound from "/sounds/sound_3.mp3"

export default function SideWallet() {
  const { status, connect, disconnect } = useWallet()
  const [show, setShow] = useState(true)
  const size = useWindowSize()
  const connected = status === "CONNECTED"
  const x = -size.width / 2 + 150

  const [play] = useSound(sound, { volume: station.volume.use() })

  return (
    <>
      <Suspense>
        <Wallet3d position={[x, 400, 0]} scale={3} />
      </Suspense>
      <Suspense>
        <Button text={connected ? "Disconnect" : "Connect"} position={[x, 250, 0]} scale={35} width={140} active={connected} onClick={() => (connected ? disconnect() : connect())} />
        <Button text={show ? "Hide" : "Show"} position={[x, 200, 0]} scale={20} onClick={() => (setShow(!show), play())} />
        <Button text={"Send"} position={[x, -225, 0]} scale={35} onClick={() => (station.Hud.event.set("Send"), play())} />
      </Suspense>
      <Suspense>
        <Coins x={x} show={show} />
      </Suspense>
    </>
  )
}

function Coins({ x, show }) {
  const connected = useConnectedWallet()
  return (
    <>
      {
        {
          mainnet: <MainCoins x={x} show={show} />,
          testnet: <MainCoins x={x} show={show} />,
          classic: <ClassicCoins x={x} show={show} />,
          localterra: <MainCoins x={x} show={show} />,
        }[connected?.network || "mainnet"]
      }
    </>
  )
}

function MainCoins({ x, show }) {
  return (
    <>
      <Coin Component={Luna} position={[x, 120, 0]} show={show} currency="uluna" />
      <Coin Component={Usdc} position={[x, 40, 0]} show={show} currency="usdc" />
      <Coin Component={Usdt} position={[x, -40, 0]} show={show} currency="usdt" />
      <Coin Component={Dai} position={[x, -120, 0]} show={show} currency="dai" />
    </>
  )
}

function ClassicCoins({ x, show }) {
  return (
    <>
      <Coin Component={Lunc} position={[x, 120, 0]} show={show} currency="uluna" />
      <Coin Component={Terra} position={[x, 40, 0]} show={show} flag={0} />
      <Coin Component={Terra} position={[x, -40, 0]} show={show} flag={16} />
      <Coin Component={Terra} position={[x, -120, 0]} show={show} flag={18} />
    </>
  )
}

const currencies = ["usd", "twd", "thb", "sgd", "sek", "sdr", "php", "nok", "myr", "mnt", "krw", "jpy", "inr", "idr", "hkd", "gbp", "eur", "dkk", "cny", "chf", "cad", "aud"]

function Coin({ position, flag, Component, currency, show }) {
  const [activeFlag, setActiveFlag] = useState(flag)
  const textColor = station.Hud.text.color.use()

  const balance = station.data.bank.balance.use()
  const connected = useConnectedWallet()
  const coinBalance = Math.floor((balance?._coins[currency || "u" + currencies.at(activeFlag)]?.amount / 1000000) * 100) / 100

  return (
    <group position={position}>
      <Suspense>
        <Component position={[-50, 0, 0]} scale={30} flag={activeFlag} setFlag={setActiveFlag} />
      </Suspense>
      <Html transform distanceFactor={400} style={{ width: "150px" }} position={[70, 0, 0]} pointerEvents="none">
        <span
          style={{
            userSelect: "none",
            fontSize: 26,
            color: textColor,
            fontFamily: "Alien League",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          <b>
            {coinBalance ? <AnimatedText text={show ? coinBalance.toString() : "---"} chars={"0123456789"} speed={20} /> : <AnimatedText text={show ? "0" : "---"} chars={"0123456789"} speed={20} />}
          </b>
        </span>
        <span
          style={{
            userSelect: "none",
            fontSize: 20,
            color: textColor,
            fontFamily: "Alien League",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {" " + (currency === "uluna" ? (connected?.network === "classic" ? "lunc" : "luna") : currency || currencies.at(activeFlag))}
        </span>
      </Html>
    </group>
  )
}
