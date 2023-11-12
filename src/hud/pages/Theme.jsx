import { MeshStandardMaterial } from "three"

import AnimatedPage from "../gui/AnimatedPage"
import Terra from "../coins/Terra"
// import { station } from "../../state"

export default function Theme() {
  return <AnimatedPage name='Theme'>{<Page />}</AnimatedPage>
}

function Page() {
  return (
    <>
      <Terra position={[-200, 0, 0]} scale={80} material={new MeshStandardMaterial({ roughness: 1, metalness: 0, color: "deeppink" })} animate onClick={() => null} />
      <Terra position={[0, 0, 0]} scale={80} material={new MeshStandardMaterial({ roughness: 0.25, metalness: 1, color: 0x0063ff })} animate onClick={() => null} />
      <Terra position={[200, 0, 0]} scale={80} material={new MeshStandardMaterial({ roughness: 0, metalness: 0, color: 0x0063ff })} animate onClick={() => null} />
    </>
  )
}
