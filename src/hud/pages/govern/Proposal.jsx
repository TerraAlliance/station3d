import { SphereGeometry } from "three"
import linkifyStr from "linkify-string"

import { station } from "../../../state"
import VotingBar from "./VotingBar"
import Html from "../../gui/Html"
import Button from "../../gui/Button"
import Terra from "../../coins/Terra"

export default function Proposal() {
  const proposal = station.Govern.proposal.use()
  const parameters = station.data.govern.parameters.use()

  return (
    <>
      <Terra position={[0, 300, 0]} scale={120} />
      <VotingBar position={[0, -100, 0]} proposal={proposal} length={700} radius={10} quorum={parameters?.tally_params.quorum.toString()} />
      <Spheres position={[0, 75, 0]} />
      <Vote position={[0, 0, 0]} />
      <Html
        position={[0, -150, 0]}
        style={{ height: "50px", fontWeight: "bold", display: "flex", alignItems: "center", flexDirection: "column", userSelect: "auto", whiteSpace: "normal" }}
        pointerEvents="auto"
      >
        <p style={{ fontSize: 30, width: "800px" }}>{proposal?.content?.title}</p>
        <div style={{ fontSize: 20, width: "800px" }} dangerouslySetInnerHTML={{ __html: linkifyStr(proposal?.content?.description, { target: "_blank" }) }}></div>
      </Html>
    </>
  )
}

function Vote({ position }) {
  return (
    <group position={position}>
      <Button text="Yes" position={[-225, 0, 0]} scale={25} />
      <Button text="No" position={[-75, 0, 0]} scale={25} />
      <Button text="Veto" position={[75, 0, 0]} scale={25} />
      <Button text="Abstain" position={[225, 0, 0]} scale={25} />
    </group>
  )
}

function Spheres({ position }) {
  const proposal = station.Govern.proposal.use()
  const tally = station.data.govern[proposal?.id].tally.use()

  const total = Number(tally?.yes) + Number(tally?.no) + Number(tally?.no_with_veto) + Number(tally?.abstain)

  return (
    <group position={position}>
      <Sphere position={[-225, 0, 0]} color={"green"} text={((tally?.yes.toString() / total) * 100).toFixed(2)} />
      <Sphere position={[-75, 0, 0]} color={"red"} text={((tally?.no.toString() / total) * 100).toFixed(2)} />
      <Sphere position={[75, 0, 0]} color={"orange"} text={((tally?.no_with_veto.toString() / total) * 100).toFixed(2)} />
      <Sphere position={[225, 0, 0]} color={"yellow"} text={((tally?.abstain.toString() / total) * 100).toFixed(2)} />
    </group>
  )
}

const geometry = new SphereGeometry(1, 32, 32)

function Sphere({ position, color, text }) {
  return (
    <group position={position}>
      <mesh geometry={geometry} scale={50}>
        <meshStandardMaterial transparent={true} roughness={0} metalness={0.5} opacity={0.5} color={color} />
      </mesh>
      <Html position={[0, 0, 0]}>
        <p style={{ fontSize: 30, color: "white", fontWeight: "bold" }}>{text}%</p>
      </Html>
    </group>
  )
}
