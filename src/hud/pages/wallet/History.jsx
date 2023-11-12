import { useWindowSize } from "@uidotdev/usehooks"

import Html from "../../gui/Html"
import Terra from "../../coins/Terra"
import { station } from "../../../state"

export default function History({ txs }) {
  const columns = 1
  const xspacing = 200
  const yspacing = 300
  const scroll = station.Hud.Wallet.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns

  return <>{txs?.slice(0, position + 3).map((t, i) => i >= position - 2 && <Tx tx={t} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} />)}</>
}

function Tx({ tx, index, columns, xspacing, yspacing }) {
  const size = useWindowSize()

  const firstmsg = tx.tx.body.messages[0]
  let type = firstmsg.toData()["@type"]
  type = type
    .substring(type.lastIndexOf(".") + 4)
    .split(/(?=[A-Z])/)
    .join(" ")

  if (type === "Begin Redelegate") {
    type = "Redelegate"
  }

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 250, 0]}>
      <Terra position={[0, 0, 0]} scale={60} animate={true} />
      <Html position={[0, -140, 0]} style={{ fontSize: 25, lineHeight: 0.1 }}>
        <span style={{ fontWeight: "bold", fontSize: 30 }}>{type} </span>
        <span style={{ fontWeight: "bold", fontSize: 30 }}>{firstmsg.amount && firstmsg.amount.amount?.toString() / 1000000} </span>
        <span style={{ fontWeight: "bold", fontSize: 30 }}>{firstmsg.amount && firstmsg.amount.denom?.slice(1)} </span>
        {getOption(firstmsg.option)}
        <span>{firstmsg.option && "on prop"} </span>
        <span style={{ fontWeight: "bold" }}>{firstmsg.proposal_id}</span>
        <p style={{ fontSize: 20, lineHeight: 2 }}> {new Date(tx.timestamp).toDateString() + " " + new Date(tx.timestamp).toLocaleTimeString()}</p>
      </Html>
    </group>
  )
}

const getOption = (option) => {
  switch (option) {
    case "VOTE_OPTION_YES":
      return <span style={{ fontWeight: "bold", color: "green" }}>Yes </span>
    case "VOTE_OPTION_NO":
      return <span style={{ fontWeight: "bold", color: "red" }}>No </span>
    case "VOTE_OPTION_NO_WITH_VETO":
      return <span style={{ fontWeight: "bold", color: "orange" }}>No with veto </span>
    case "VOTE_OPTION_ABSTAIN":
      return <span style={{ fontWeight: "bold", color: "yellow" }}>Abstain </span>
  }
}
