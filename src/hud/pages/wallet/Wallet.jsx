import { useState } from "react"
import { useWindowSize } from "@uidotdev/usehooks"
import useSound from "use-sound"

import { station } from "../../../state"
import AnimatedPage from "../../gui/AnimatedPage"
import Button from "../../gui/Button"
import sound from "/sounds/sound_5.mp3"

import History from "./History"
import Assets from "./Assets"

export default function Wallet() {
  const txs = station.data.tx.history.use()
  return <AnimatedPage name='Wallet'>{station.Hud.Wallet.active.use() && <Page txs={txs} />}</AnimatedPage>
}

function Page({ txs }) {
  const size = useWindowSize()
  const [location, setLocation] = useState("assets")

  const [play] = useSound(sound, { volume: station.volume.use() * 3 })

  return (
    <>
      <Button text={"Assets"} position={[-100, size.height / 2 - 100, 0]} scale={35} onClick={() => (play(), setLocation("assets"))} />
      <Button text={"History"} position={[100, size.height / 2 - 100, 0]} scale={35} onClick={() => (play(), setLocation("history"))} />
      {
        {
          assets: <Assets />,
          history: <History txs={txs} />,
        }[location]
      }
    </>
  )
}
