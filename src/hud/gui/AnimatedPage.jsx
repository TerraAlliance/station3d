import { useEffect } from "react"
import { useSpringValue, animated } from "@react-spring/three"

import { station } from "../../state"
;["History", "Wallet", "Stake", "Govern", "VotingHistory", "Send"].forEach((page) => {
  station.Hud[page].scroll.set(0)
})

window.onwheel = (ev) => {
  station.Hud[station.Hud.event.get()].scroll.set((prev) => Math.max(prev + ev.deltaY / 2, 0))
console.log(ev.deltaY)
  switch (station.Hud.event.get()) {
    case "Validator":
      station.Hud.event.set("Stake")
      station.Hud.Stake.event.set("play")
      break
    case "Delegate":
    case "Redelegate":
    case "Undelegate":
      station.Hud.event.set("Validator")
      station.Hud.Stake.event.set("play")
      break
    case "Proposal":
      station.Hud.event.set("Govern")
      station.Hud.Stake.event.set("play")
      break
  }
}

export default function AnimatedPage({ name, children, scrollPage = true }) {
  const event = station.Hud.event.use()
  const scroll = station.Hud[name].scroll.use()

  const position = useSpringValue(scroll - 1200, { config: { mass: 1, friction: 15, tension: 150, clamp: true } })

  useEffect(() => {
    if (event === name) {
      station.Hud[name].active.set(true)
      position.start(scrollPage ? scroll || 0 : 0)
    } else {
      position.start((scrollPage ? scroll || 0 : 0) - 1200).then(() => station.Hud[name].active.set(false))
    }
  }, [event, scroll, children])

  return <animated.group position={position.to((v) => [0, v, 0])}>{children}</animated.group>
}
