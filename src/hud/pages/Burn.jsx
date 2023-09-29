import { useState } from "react"
import { useConnectedWallet } from "@terra-money/wallet-kit"
import useSound from "use-sound"

import { station } from "../../state"

import AnimatedPage from "../gui/AnimatedPage"
import AnimatedText from "../gui/AnimatedText"
import Html from "../gui/Html"
import Button from "../gui/Button"
import sound from "/sounds/sound_19.mp3"
import Lunc from "../coins/Lunc"
import Luna from "../coins/Luna"
import Terra from "../coins/Terra"
import FireSphere from "../coins/FireSphere"

export default function Burn() {
  const total = station.data.balance.total.use()

  return <AnimatedPage name='Burn'>{station.Hud.Burn.active.use() && <Page total={total} />}</AnimatedPage>
}

function Page({ total }) {
  const [play] = useSound(sound, { volume: station.volume.use() })
  const connected = useConnectedWallet()

  return (
    <>
      {
        {
          mainnet: <Main total={total} play={play} />,
          testnet: <Main total={total} play={play} />,
          classic: <Classic total={total} play={play} />,
          localterra: <Main total={total} play={play} />,
        }[connected?.network || "mainnet"]
      }
    </>
  )
}

function Main({ total, play }) {
  return (
    <>
      <Luna position={[0, 0, 0]} scale={130} />
      <Html position={[0, -180, 0]} style={{ fontSize: 35 }}>
        <span>{"supply: "}</span>
        <b>{<AnimatedText text={Math.round(total?.uluna.amount / 1000000).toString()} chars={"0123456789"} speed={20} />}</b>
      </Html>
      <Button text='Burn' position={[0, -250, 0]} scale={35} selectedColor='yellow' onClick={() => play()} />
    </>
  )
}

const currencies = ["uusd", "utwd", "uthb", "usgd", "usek", "usdr", "uphp", "unok", "umyr", "umnt", "ukrw", "ujpy", "uinr", "uidr", "uhkd", "ugbp", "ueur", "udkk", "ucny", "uchf", "ucad", "uaud"]

function Classic({ total, play }) {
  const [activeFlag, setActiveFlag] = useState(0)

  return (
    <>
      <Lunc position={[-200, 0, 0]} scale={130} />
      <FireSphere position={[-200, 0, 0]} scale={131} />
      <FireSphere position={[200, 0, 0]} scale={131} />
      <Terra position={[200, 0, 0]} scale={130} flag={activeFlag} setFlag={setActiveFlag} />
      <Html position={[-200, -180, 0]} style={{ fontSize: 35 }}>
        <span>{"supply: "}</span>
        <b>{<AnimatedText text={Math.round(total?.uluna.amount / 1000000).toString()} chars={"0123456789"} speed={20} />}</b>
      </Html>
      <Html position={[200, -180, 0]} style={{ fontSize: 35 }}>
        <span>{"supply: "}</span>
        <b>{<AnimatedText text={Math.round(total?.[currencies.at(activeFlag)]?.amount / 1000000).toString()} chars={"0123456789"} speed={20} />}</b>
      </Html>
      <Button text='Burn' position={[-200, -250, 0]} scale={35} selectedColor='yellow' onClick={() => play()} />
      <Button text='Burn' position={[200, -250, 0]} scale={35} selectedColor='yellow' onClick={() => play()} />
    </>
  )
}
