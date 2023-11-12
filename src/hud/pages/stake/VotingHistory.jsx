import { useEffect, useState } from "react"
import { useLcdClient, useConnectedWallet } from "@terra-money/wallet-kit"
import { useWindowSize } from "@uidotdev/usehooks"

import Title from "../../gui/Title"
import Html from "../../gui/Html"
import Terra from "../../coins/Terra"

import { station } from "../../../state"

export default function VotingHistory() {
  const validator = station.Stake.validator.use()
  const lcd = useLcdClient()
  const connected = useConnectedWallet()
  const chainID = station.chainID.use()
  const [proposals, setProposals] = useState()

  useEffect(() => {
    validator && lcd.gov.proposals(chainID, { "pagination.limit": 999, "pagination.offset": 1576 }).then(([proposals]) => setProposals(proposals.reverse()))
  }, [connected])

  return (
    <>
      <Proposals proposals={proposals} validator={validator} />
    </>
  )
}

function Proposals({ proposals }) {
  const columns = 1
  const xspacing = 500
  const yspacing = 300
  const scroll = station.Hud.VotingHistory.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns

  return (
    <>
      {position < 2 && <Title text="Voting History" />}
      {proposals?.slice(0, position + 6).map((p, i) => i >= position - 2 && <Proposal proposal={p} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} />)}
    </>
  )
}

function Proposal({ proposal, index, columns, xspacing, yspacing }) {
  const size = useWindowSize()

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 300, 0]}>
      <Terra position={[0, 0, 0]} scale={60} animate={true} onClick={() => (station.Govern.proposal.set(proposal), station.Hud.event.set("Proposal"))} />?
      <Html style={{ fontSize: 25, width: "400px", textAlign: "center", fontWeight: "bold" }} position={[0, -140, 0]}>
        <p>{proposal.id}</p>
        <p>{proposal.content.title}</p>
      </Html>
    </group>
  )
}
