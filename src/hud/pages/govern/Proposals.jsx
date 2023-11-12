import { useWindowSize } from "@uidotdev/usehooks"
import useSound from "use-sound"

import { station } from "../../../state"
import VotingBar from "./VotingBar"
import Html from "../../gui/Html"
import Terra from "../../coins/Terra"
import sound from "/sounds/sound_6.mp3"

const touch = "ontouchstart" in document.documentElement

export default function Proposals() {
  const proposals = station.data.govern.proposals.use()

  const columns = touch ? 1 : 2
  const xspacing = 500
  const yspacing = 300
  const scroll = station.Hud.Govern.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns

  const [play] = useSound(sound, {
    volume: station.volume.use(),
    sprite: { 0: [500, 1000] },
  })

  return (
    <>{proposals?.slice(0, position + 6).map((p, i) => i >= position - 2 && <Proposal proposal={p} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} play={play} p />)}</>
  )
}

function Proposal({ proposal, index, columns, xspacing, yspacing, play }) {
  const size = useWindowSize()
  const parameters = station.data.govern.parameters.use()

  const onClick = () => {
    station.Govern.proposal.set(proposal)
    station.Hud.event.set("Proposal")
    play({ id: "0" })
  }

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 150, 0]}>
      <Terra position={[0, 0, 0]} scale={60} animate={true} onClick={onClick} />
      <VotingBar position={[0, -90, 0]} proposal={proposal} length={250} radius={6} quorum={parameters?.tally_params.quorum.toString()} />
      <Html position={[0, -140, 0]}>{<p style={{ fontSize: 25, width: "400px", height: "50px", fontWeight: "bold", whiteSpace: "normal" }}>{proposal?.content?.title}</p>}</Html>
    </group>
  )
}
