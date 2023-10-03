import { station } from "../../../state"
import AnimatedPage from "../../gui/AnimatedPage"
import Proposals from "./Proposals"
import Proposal from "./Proposal"

export default function Govern() {
  return (
    <>
      <AnimatedPage name="Govern">{station.Hud.Govern.active.use() && <Proposals />}</AnimatedPage>
      <AnimatedPage name="Proposal">{station.Hud.Proposal.active.use() && <Proposal />}</AnimatedPage>
    </>
  )
}
