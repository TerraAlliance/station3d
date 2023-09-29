import linkifyStr from "linkify-string"

import { station } from "../../../state"
import Html from "../../gui/Html"
// import Button from "../../gui/Button"

export default function Proposal() {
  const proposal = station.Govern.proposal.use()

  return (
    <>
      <Html
        position={[0, -150, 0]}
        style={{ height: "50px", fontWeight: "bold", display: "flex", alignItems: "center", flexDirection: "column", userSelect: "auto", whiteSpace: "normal" }}
        pointerEvents='auto'
      >
        <p style={{ fontSize: 30, width: "800px" }}>{proposal?.content.title}</p>
        <div style={{ fontSize: 20, width: "800px" }} dangerouslySetInnerHTML={{ __html: linkifyStr(proposal?.content.description, { target: "_blank" }) }}></div>
      </Html>
    </>
  )
}
