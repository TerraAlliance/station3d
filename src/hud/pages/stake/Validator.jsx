import useSound from "use-sound"

import Html from "../../gui/Html"
import Button from "../../gui/Button"
import Satellite from "../../objects/Satellite"
import sound from "/sounds/sound_5.mp3"

import { station } from "../../../state"

export default function ValidatorPage() {
  const validator = station.Stake.validator.use()
  const staked = station.data.stake.total.use()

  const [play] = useSound(sound, { volume: station.volume.use() * 3 })

  return (
    <>
      <Satellite rotation={[0, 0, (7 / 4) * Math.PI]} scale={7.5} />
      <Html position={[0, 230, 0]}>
        <div style={{ height: "50px" }}>{<p style={{ fontSize: 40, fontWeight: "bold", width: "700px", overflow: "hidden", textOverflow: "ellipsis" }}>{validator?.description.moniker}</p>}</div>
        <div style={{ height: "50px" }}>
          <p style={{ fontSize: 25 }}>
            VP: <b>{((Math.floor(validator?.tokens.toString() / 1000000) / (staked / 1000000)) * 100).toFixed(2)}% </b>
            commision: <b>{validator?.commission.commission_rates.rate.toString() * 100}% </b>
            max comm.: <b>{validator?.commission.commission_rates.max_rate.toString() * 100}%</b>
          </p>
        </div>
      </Html>
      <Button text="Delegate" position={[-200, -250, 0]} scale={30} onClick={() => (station.Hud.event.set("Delegate"), play())} />
      <Button text="Redelegate" position={[0, -250, 0]} scale={30} onClick={() => (station.Hud.event.set("Redelegate"), play())} />
      <Button text="Undelegate" position={[200, -250, 0]} scale={30} onClick={() => (station.Hud.event.set("Undelegate"), play())} />
      <Button text="Voting History" position={[0, -325, 0]} scale={30} onClick={() => (station.Hud.event.set("VotingHistory"), play())} />
    </>
  )
}
