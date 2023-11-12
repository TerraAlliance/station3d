import { useWindowSize } from "@uidotdev/usehooks"

import Html from "../../gui/Html"
import Orion from "../../validators/Orion"
import Satellite from "../../objects/Satellite"
import Jail from "../../objects/Jail"

import { station } from "../../../state"

const sortingLogic = {
  "vpsort+": (a, b) => {
    if (Number(a.jailed ? 0 : a.tokens) < Number(b.jailed ? 0 : b.tokens)) return 1
    if (Number(a.jailed ? 0 : a.tokens) > Number(b.jailed ? 0 : b.tokens)) return -1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "vpsort-": (a, b) => {
    if (Number(a.jailed ? 0 : a.tokens) < Number(b.jailed ? 0 : b.tokens)) return -1
    if (Number(a.jailed ? 0 : a.tokens) > Number(b.jailed ? 0 : b.tokens)) return 1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "cosort+": (a, b) => {
    if (Number(a.commission.commission_rates.rate) < Number(b.commission.commission_rates.rate)) return 1
    if (Number(a.commission.commission_rates.rate) > Number(b.commission.commission_rates.rate)) return -1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "cosort-": (a, b) => {
    if (Number(a.commission.commission_rates.rate) < Number(b.commission.commission_rates.rate)) return -1
    if (Number(a.commission.commission_rates.rate) > Number(b.commission.commission_rates.rate)) return 1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "nmsort+": (a, b) => a.description.moniker.localeCompare(b.description.moniker),
  "nmsort-": (a, b) => b.description.moniker.localeCompare(a.description.moniker),
}

export default function Validators({ validators, sort, xspacing, yspacing, play, columns, position }) {
  return (
    <>
      {validators
        ?.sort(sortingLogic[sort])
        .slice(0, position + 16)
        .map((v, i) => i >= position - 8 && <Validator validator={v} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} play={play} />)}
    </>
  )
}

const validatorLogos = { terravaloper1259cmu5zyklsdkmgstxhwqpe0utfe5hhyty0at: Orion }

function Validator({ validator, index, columns, xspacing, yspacing, play }) {
  const size = useWindowSize()
  const staked = station.data.stake.total.use()

  const Component = validatorLogos[validator.operator_address]

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 300, 0]}>
      <Html style={{ fontSize: 20, border: "2px solid #181818", borderRadius: "10px", height: "60px", width: "190px" }} position={[0, -110, 0]}>
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", width: "180px", fontWeight: "bold", margin: "5px" }}>{validator.description.moniker}</p>
        <p style={{ margin: "5px", marginTop: "10px" }}>
          <span>
            VP: <b>{validator.jailed ? 0 : ((Math.floor(validator?.tokens.toString() / 1000000) / (staked / 1000000)) * 100).toFixed(2)}% </b>
          </span>
          <span>
            CM: <b>{Math.floor(validator?.commission.commission_rates.rate.toString() * 100)}%</b>
          </span>
        </p>
      </Html>
      <Html style={{ fontSize: 30 }} position={[40, -40, 0]}>
        {validator.description.moniker === "🔥 Lunc Academy x Oneiric Stake 🚀" ? <p>👍</p> : null}
      </Html>
      {validator.operator_address in validatorLogos ? (
        <Component scale={50} onClick={() => (station.Stake.validator.set(validator), station.Hud.event.set("Validator"), play())} />
      ) : (
        <Satellite
          rotation={[0, 0, (7 / 4) * Math.PI]}
          scale={2.25}
          startAnimation={index * 0.05}
          onClick={() => (station.Stake.validator.set(validator), station.Hud.event.set("Validator"), play())}
        />
      )}
      {validator.jailed && <Jail />}
    </group>
  )
}
