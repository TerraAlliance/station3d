import { useWindowSize } from "@uidotdev/usehooks"
import { Html } from "@react-three/drei"

import { station } from "../../state"

export default function Title({ text }) {
  const textColor = station.Hud.text.color.use()
  const size = useWindowSize()

  return (
    <>
      <Html transform distanceFactor={400} position={[0, size.height / 2 - 100, 0]} pointerEvents='none'>
        <p style={{ fontSize: 100, color: textColor, fontFamily: "Alien League", userSelect: "none" }}>{text}</p>
      </Html>
    </>
  )
}
