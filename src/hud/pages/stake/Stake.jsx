import { useState } from "react"
import { useWindowSize } from "@uidotdev/usehooks"
import useSound from "use-sound"

import Rewards from "./Rewards"

import AnimatedPage from "../../gui/AnimatedPage"
import Button from "../../gui/Button"
import sound from "/sounds/sound_5.mp3"
import sound_1 from "/sounds/sound_14.mp3"

import Validators from "./Validators"
import Validator from "./Validator"
import ValidatorSphere from "./ValidatorSphere"
import VotingHistory from "./VotingHistory"
import { Delegate, Undelegate, Redelegate } from "./Delegation"

import { station } from "../../../state"

export default function Stake() {
  const [play] = useSound(sound_1, { volume: station.volume.use() })
  const event = station.Hud.Stake.event.use()
  if (event === "play") play(), station.Hud.Stake.event.set("")

  return (
    <>
      <AnimatedPage name="Stake">{station.Hud.Stake.active.use() && <Page />}</AnimatedPage>
      <AnimatedPage name="Validator">{station.Hud.Validator.active.use() && <Validator />}</AnimatedPage>
      <AnimatedPage name="Delegate">{station.Hud.Delegate.active.use() && <Delegate />}</AnimatedPage>
      <AnimatedPage name="Redelegate">{station.Hud.Redelegate.active.use() && <Redelegate />}</AnimatedPage>
      <AnimatedPage name="Undelegate">{station.Hud.Undelegate.active.use() && <Undelegate />}</AnimatedPage>
      <AnimatedPage name="VotingHistory">{station.Hud.VotingHistory.active.use() && <VotingHistory />}</AnimatedPage>
    </>
  )
}

function Page() {
  const validators = station.data.stake.validators.use()
  const [location, setLocation] = useState("grid")

  const sort = station.Hud.Stake.sort.use()
  const columns = "ontouchstart" in document.documentElement ? 1 : 4
  const xspacing = 200
  const yspacing = 200
  const scroll = station.Hud.Stake.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns
  const size = useWindowSize()

  const [play] = useSound(sound, { volume: station.volume.use() * 3 })

  return (
    <>
      {position < 6 && (
        <>
          <Button text="Grid" position={[-200, size.height / 2 - 100, 0]} scale={35} selectedColor="yellow" onClick={() => (setLocation("grid"), play())} />
          <Button text="Sphere" position={[0, size.height / 2 - 100, 0]} scale={35} selectedColor="yellow" onClick={() => (setLocation("sphere"), play())} />
          <Button text="Rewards" position={[200, size.height / 2 - 100, 0]} scale={35} selectedColor="yellow" onClick={() => (setLocation("rewards"), play())} />
        </>
      )}
      {
        {
          grid: (
            <>
              {position < 6 && <SortMenu />}
              <Validators validators={validators} sort={sort || "vpsort+"} xspacing={xspacing} yspacing={yspacing} play={play} columns={columns} position={position} />
            </>
          ),
          sphere: (
            <>
              {position < 6 && <SortMenu />}
              <ValidatorSphere validators={validators} sort={sort || "vpsort+"} play={play} />
            </>
          ),
          rewards: <Rewards />,
        }[location]
      }
    </>
  )
}

function SortMenu() {
  const size = useWindowSize()
  const [play] = useSound(sound, { volume: station.volume.use() * 3 })

  return (
    <>
      <Button
        text="Name"
        position={[-175, size.height / 2 - 175, 0]}
        scale={20}
        selectedColor="yellow"
        onClick={() => (station.Hud.Stake.sort.set((p) => (p === "nmsort+" ? "nmsort-" : "nmsort+")), play())}
      />
      <Button
        text="Voting Power"
        position={[0, size.height / 2 - 175, 0]}
        scale={20}
        selectedColor="yellow"
        onClick={() => (station.Hud.Stake.sort.set((p) => (p === "vpsort+" ? "vpsort-" : "vpsort+")), play())}
      />
      <Button
        text="Commission"
        position={[175, size.height / 2 - 175, 0]}
        scale={20}
        selectedColor="yellow"
        onClick={() => (station.Hud.Stake.sort.set((p) => (p === "cosort+" ? "cosort-" : "cosort+")), play())}
      />
    </>
  )
}
