import { useState } from "react"
import { Html, useCursor } from "@react-three/drei"
import { useSpringValue, animated } from "@react-spring/three"

import { station } from "../../state"

station.Hud.text.color.set("orange")
station.Hud.Button.position.z.set(-4800)
station.Hud.Button.text.font.set("Alien League")
station.Hud.Button.body.color.set("blue")
station.Hud.Button.body.color.set("blue")

function displayTextWidth(text, font, scale) {
  let context = document.createElement("canvas").getContext("2d")
  context.font = scale + "px " + font
  return context.measureText(text).width
}

export default function Button({ text = "Button", position = [0, 0, 0], rotation, scale = 35, width, selectedColor = "yellow", opacity = 1, onClick, active }) {
  const z = station.Hud.Button.position.z.use()
  const textColor = station.Hud.text.color.use()
  const font = station.Hud.Button.text.font.use()
  const bodyColor = station.Hud.Button.body.color.use()

  const explode = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 1000, clamp: true } })
  const [_bodyColor, setBodyColor] = useState(active ? selectedColor : bodyColor)
  const [hovered, setHover] = useState(false)
  useCursor(hovered)

  return (
    <animated.group position={explode.to((v) => [position[0], position[1] - v / 500, position[2] + z + v])} rotation={rotation}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => {
          setHover(false)
          setBodyColor(bodyColor)
          explode.start(0)
        }}
        onPointerDown={() => {
          setBodyColor(selectedColor)
          explode.start(2100)
        }}
        onPointerUp={() => {
          setBodyColor(bodyColor)
          explode.start(0)
        }}
        rotation-z={90 * (Math.PI / 180)}
      >
        <capsuleGeometry args={[scale * 0.7, width || displayTextWidth(text, font, scale), 5, 20]} />
        <meshStandardMaterial color={selectedColor ? _bodyColor : bodyColor} transparent='true' opacity={opacity} depthWrite={false} />
      </mesh>
      <Html transform pointerEvents='none'>
        <p style={{ userSelect: "none", fontSize: scale * 40, color: textColor, fontFamily: font, whiteSpace: "nowrap" }}>{text}</p>
      </Html>
    </animated.group>
  )
}
