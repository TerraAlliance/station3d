import { Html as _Html } from "@react-three/drei"

import { station } from "../../state"

export default function Html({ position, children, style, pointerEvents }) {
  const textColor = station.Hud.text.color.use()

  return (
    <>
      <_Html
        transform
        distanceFactor={400}
        position={position}
        pointerEvents={pointerEvents || "none"}
        style={{ color: textColor, fontFamily: "Alien League", userSelect: "none", textAlign: "center", whiteSpace: "nowrap", ...style }}
      >
        {children}
      </_Html>
    </>
  )
}
