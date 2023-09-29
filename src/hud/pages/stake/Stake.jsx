import { useEffect, useState, useRef } from "react"
import { SphereGeometry, MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"
import { Html as _Html } from "@react-three/drei"
import { useLcdClient, useConnectedWallet, useWallet } from "@terra-money/wallet-kit"
import { useWindowSize } from "@uidotdev/usehooks"
import { MsgDelegate, MsgBeginRedelegate, MsgUndelegate, Coin, Coins, Fee } from "@terra-money/feather.js"
import useSound from "use-sound"

import Rewards from "./Rewards"

import AnimatedPage from "../../gui/AnimatedPage"
import AnimatedText from "../../gui/AnimatedText"
import Title from "../../gui/Title"
import Html from "../../gui/Html"
import Button from "../../gui/Button"
import Terra from "../../coins/Terra"
import Orion from "../../validators/Orion"
import Satellite from "../../objects/Satellite"
import Jail from "../../objects/Jail"
import sound from "/sounds/sound_5.mp3"
import sound_1 from "/sounds/sound_14.mp3"
import { useGas, useTaxRate, useGasPrice } from "../../../queries"

import { station } from "../../../state"

const touch = "ontouchstart" in document.documentElement

export default function Stake() {
  const [play] = useSound(sound_1, { volume: station.volume.use() })
  const event = station.Hud.Stake.event.use()
  if (event === "play") play(), station.Hud.Stake.event.set("")

  return (
    <>
      <AnimatedPage name='Stake'>{station.Hud.Stake.active.use() && <Page />}</AnimatedPage>
      <AnimatedPage name='Validator'>{station.Hud.Validator.active.use() && <ValidatorPage />}</AnimatedPage>
      <AnimatedPage name='Delegate'>{station.Hud.Delegate.active.use() && <Delegate />}</AnimatedPage>
      <AnimatedPage name='Redelegate'>{station.Hud.Redelegate.active.use() && <Redelegate />}</AnimatedPage>
      <AnimatedPage name='Undelegate'>{station.Hud.Undelegate.active.use() && <Undelegate />}</AnimatedPage>
      <AnimatedPage name='VotingHistory'>{station.Hud.VotingHistory.active.use() && <VotingHistory />}</AnimatedPage>
    </>
  )
}

const sortingLogic = {
  "vpsort+": (a, b) => {
    if (Number(a.jailed ? 0 : a.tokens) < Number(b.jailed ? 0 : b.tokens)) return 1
    if (Number(a.jailed ? 0 : a.tokens) > Number(b.jailed ? 0 : b.tokens)) return -1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "vpsort-": (a, b) => {
    if (Number(a.jailed ? 0 : a.tokens) < Number(b.jailed ? 0 : b.tokens)) return -1
    if (Number(a.jailed ? 0 : a.tokens) > Number(b.jailed ? 0 : b.tokens)) return 1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "cosort+": (a, b) => {
    if (Number(a.commission.commission_rates.rate) < Number(b.commission.commission_rates.rate)) return 1
    if (Number(a.commission.commission_rates.rate) > Number(b.commission.commission_rates.rate)) return -1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "cosort-": (a, b) => {
    if (Number(a.commission.commission_rates.rate) < Number(b.commission.commission_rates.rate)) return -1
    if (Number(a.commission.commission_rates.rate) > Number(b.commission.commission_rates.rate)) return 1
    return a.description.moniker.localeCompare(b.description.moniker)
  },
  "nmsort+": (a, b) => a.description.moniker.localeCompare(b.description.moniker),
  "nmsort-": (a, b) => b.description.moniker.localeCompare(a.description.moniker),
}

function Page() {
  const validators = station.data.stake.validators.use()
  const [location, setLocation] = useState("grid")

  const sort = station.Hud.Stake.sort.use()
  const columns = touch ? 1 : 4
  const xspacing = 200
  const yspacing = 200
  const scroll = station.Hud.Stake.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns
  const size = useWindowSize()

  const [play] = useSound(sound, { volume: station.volume.use() * 3 })

  return (
    <>
      {position < 8 && (
        <>
          <Button text='Grid' position={[-200, size.height / 2 - 100, 0]} scale={35} selectedColor='yellow' onClick={() => (setLocation("grid"), play())} />
          <Button text='Sphere' position={[0, size.height / 2 - 100, 0]} scale={35} selectedColor='yellow' onClick={() => (setLocation("sphere"), play())} />
          <Button text='Rewards' position={[200, size.height / 2 - 100, 0]} scale={35} selectedColor='yellow' onClick={() => (setLocation("rewards"), play())} />
        </>
      )}
      {
        {
          grid: (
            <>
              <Button
                text='Name'
                position={[-175, size.height / 2 - 175, 0]}
                scale={20}
                selectedColor='yellow'
                onClick={() => (station.Hud.Stake.sort.set((p) => (p === "nmsort+" ? "nmsort-" : "nmsort+")), play())}
              />
              <Button
                text='Voting Power'
                position={[0, size.height / 2 - 175, 0]}
                scale={20}
                selectedColor='yellow'
                onClick={() => (station.Hud.Stake.sort.set((p) => (p === "vpsort+" ? "vpsort-" : "vpsort+")), play())}
              />
              <Button
                text='Commission'
                position={[175, size.height / 2 - 175, 0]}
                scale={20}
                selectedColor='yellow'
                onClick={() => (station.Hud.Stake.sort.set((p) => (p === "cosort+" ? "cosort-" : "cosort+")), play())}
              />
              <Validators validators={validators} sort={sort || "vpsort+"} xspacing={xspacing} yspacing={yspacing} play={play} columns={columns} position={position} />
            </>
          ),
          sphere: (
            <>
              <Button
                text='Name'
                position={[-175, size.height / 2 - 175, 0]}
                scale={20}
                selectedColor='yellow'
                onClick={() => (station.Hud.Stake.sort.set((p) => (p === "nmsort+" ? "nmsort-" : "nmsort+")), play())}
              />
              <Button
                text='Voting Power'
                position={[0, size.height / 2 - 175, 0]}
                scale={20}
                selectedColor='yellow'
                onClick={() => (station.Hud.Stake.sort.set((p) => (p === "vpsort+" ? "vpsort-" : "vpsort+")), play())}
              />
              <Button
                text='Commission'
                position={[175, size.height / 2 - 175, 0]}
                scale={20}
                selectedColor='yellow'
                onClick={() => (station.Hud.Stake.sort.set((p) => (p === "cosort+" ? "cosort-" : "cosort+")), play())}
              />
              <ValidatorSphere validators={validators} sort={sort || "vpsort+"} xspacing={xspacing} yspacing={yspacing} play={play} columns={columns} position={position} />
            </>
          ),
          rewards: <Rewards />,
        }[location]
      }
    </>
  )
}

function ValidatorSphere({ validators, sort, xspacing, yspacing, play, columns }) {
  const group = useRef()

  useFrame((state, delta) => {
    group.current.rotation.y -= delta * 0.1
  })

  return (
    <>
      <mesh position={[0, -100, 0]} scale={292.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={"blue"} transparent={true} roughness={0.5} metalness={1} opacity={0.2} depthWrite={false} />
      </mesh>
      <group ref={group}>
        {validators?.sort(sortingLogic[sort]).map((v, i) => (
          <ValidatorSpheres validator={v} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} play={play} totalValidators={validators.length - 1} />
        ))}
      </group>
    </>
  )
}

const sphere = new SphereGeometry(1, 32, 32)
const material_1 = new MeshStandardMaterial({ transparent: true, opacity: 0.2, color: "blue" })
const material_2 = new MeshStandardMaterial({ roughness: 0.25, metalness: 1, color: 0xffa500 })

function ValidatorSpheres({ validator, index, totalValidators }) {
  const staked = station.data.stake.total.use()

  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const offset = 2 / totalValidators
  const y = 1 - index * offset + offset / 2 - 1 / totalValidators
  const radius = Math.sqrt(1 - y * y)
  const theta = goldenAngle * index

  const x = Math.cos(theta) * radius
  const z = Math.sin(theta) * radius

  const textColor = station.Hud.text.color.use()

  const scale = validator.jailed ? 0 : Math.pow((3 * (Math.floor(validator?.tokens.toString()) / staked) * 500000) / (4 * Math.PI), 1 / 3)

  return (
    <group position={[x * 300, y * 300 - 100, z * 300]}>
      <mesh geometry={sphere} material={material_2} scale={scale} />
      <mesh geometry={sphere} material={material_1} scale={15} />
      <_Html
        center
        style={{ color: textColor, fontFamily: "Alien League", userSelect: "none", textAlign: "center", whiteSpace: "nowrap", fontSize: 10 }}
        position={[0, scale > 15 ? scale + 5 : 20, 0]}
      >
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", width: "60px", fontWeight: "bold" }}>{validator.description.moniker}</p>
      </_Html>
    </group>
  )
}

// function ValidatorCircle({ validators, sort, xspacing, yspacing, play, columns }) {
//   const group = useRef()

//   // useFrame((state, delta) => {
//   //   group.current.rotation.z -= delta * 0.1
//   // })

//   return (
//     <>
//       <group ref={group}>
//         {validators?.sort(sortingLogic[sort]).map((v, i) => (
//           <ValidatorCircles validator={v} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} play={play} totalValidators={validators.length - 1} />
//         ))}
//       </group>
//     </>
//   )
// }

// function ValidatorCircles({ validator, index, totalValidators = 118 }) {
//   const staked = station.data.stake.total.use()

//   const circleRadius = 300
//   const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle for Fibonacci lattice
//   const y = 1 - index / totalValidators // Distribute points vertically between -1 and 1

//   const radius = circleRadius * Math.sqrt(1 - y * y) // Adjust radius based on y-coordinate
//   const theta = phi * index // Angular position based on the golden angle

//   // Calculate Cartesian coordinates
//   const x = radius * Math.cos(theta)
//   const z = radius * Math.sin(theta)

//   const scale = validator.jailed ? 0 : Math.pow((3 * (Math.floor(validator?.tokens.toString()) / staked) * 1000000) / (4 * Math.PI), 1 / 3)

//   const textColor = station.Hud.text.color.use()

//   return (
//     <group position={[x, z - 100, 0]}>
//       <mesh geometry={sphere} material={material_2} scale={scale}></mesh>
//       <_Html
//         center
//         style={{ color: textColor, fontFamily: "Alien League", userSelect: "none", textAlign: "center", whiteSpace: "nowrap", fontSize: 10 }}
//         position={[0, scale > 15 ? scale + 5 : 20, 0]}
//       >
//         <p style={{ overflow: "hidden", textOverflow: "ellipsis", width: "50px", fontWeight: "bold" }}>{validator.description.moniker}</p>
//       </_Html>
//     </group>
//   )
// }

function Validators({ validators, sort, xspacing, yspacing, play, columns, position }) {
  return (
    <>
      {validators
        ?.sort(sortingLogic[sort])
        .slice(0, position + 16)
        .map((v, i) => i >= position - 8 && <Validator validator={v} index={i} key={i} columns={columns} xspacing={xspacing} yspacing={yspacing} play={play} />)}
    </>
  )
}

const validatorLogos = { terravaloper1259cmu5zyklsdkmgstxhwqpe0utfe5hhyty0at: Orion }

function Validator({ validator, index, columns, xspacing, yspacing, play }) {
  const size = useWindowSize()
  const staked = station.data.stake.total.use()

  const Component = validatorLogos[validator.operator_address]

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 300, 0]}>
      <Html style={{ fontSize: 20 }} position={[0, -110, 0]}>
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", width: "180px", fontWeight: "bold", margin: "0px" }}>{validator.description.moniker}</p>
        <p style={{ marginTop: "10px" }}>
          <span>
            VP: <b>{validator.jailed ? 0 : ((Math.floor(validator?.tokens.toString() / 1000000) / (staked / 1000000)) * 100).toFixed(2)}% </b>
          </span>
          <span>
            CM: <b>{Math.floor(validator?.commission.commission_rates.rate.toString() * 100)}%</b>
          </span>
        </p>
      </Html>
      <Html style={{ fontSize: 30 }} position={[40, -40, 0]}>
        {validator.description.moniker === "🔥 Lunc Academy x Oneiric Stake 🚀" ? <p>👍</p> : null}
      </Html>
      {validator.operator_address in validatorLogos ? (
        <Component scale={50} onClick={() => (station.Stake.validator.set(validator), station.Hud.event.set("Validator"), play())} />
      ) : (
        <Satellite
          rotation={[0, 0, (7 / 4) * Math.PI]}
          scale={2.25}
          startAnimation={index * 0.05}
          onClick={() => (station.Stake.validator.set(validator), station.Hud.event.set("Validator"), play())}
        />
      )}
      {validator.jailed && <Jail />}
    </group>
  )
}

function ValidatorPage() {
  const validator = station.Stake.validator.use()
  const staked = station.data.stake.total.use()

  const [play] = useSound(sound, { volume: station.volume.use() * 3 })

  return (
    <>
      <Satellite rotation={[0, 0, (7 / 4) * Math.PI]} scale={7.5} />
      <Html position={[0, 230, 0]}>
        <div style={{ height: "50px" }}>{<p style={{ fontSize: 40, fontWeight: "bold", width: "700px", overflow: "hidden", textOverflow: "ellipsis" }}>{validator?.description.moniker}</p>}</div>
        <div style={{ height: "50px" }}>
          <p style={{ fontSize: 25 }}>
            VP: <b>{((Math.floor(validator?.tokens.toString() / 1000000) / (staked / 1000000)) * 100).toFixed(2)}% </b>
            commision: <b>{validator?.commission.commission_rates.rate.toString() * 100}% </b>
            max comm.: <b>{validator?.commission.commission_rates.max_rate.toString() * 100}%</b>
          </p>
        </div>
      </Html>
      <Button text='Delegate' position={[-200, -250, 0]} scale={30} onClick={() => (station.Hud.event.set("Delegate"), play())} />
      <Button text='Redelegate' position={[0, -250, 0]} scale={30} onClick={() => (station.Hud.event.set("Redelegate"), play())} />
      <Button text='Undelegate' position={[200, -250, 0]} scale={30} onClick={() => (station.Hud.event.set("Undelegate"), play())} />
      <Button text='Voting History' position={[0, -325, 0]} scale={30} onClick={() => (station.Hud.event.set("VotingHistory"), play())} />
    </>
  )
}

function Delegate() {
  const validator = station.Stake.validator.use()

  const [amount, setAmount] = useState("")
  const connected = useConnectedWallet()
  const chainID = connected ? getChainID(connected.network) : "phoenix-1"

  const simMsg = { chainID: chainID, msgs: [new MsgDelegate(connected?.addresses[chainID], validator.operator_address, new Coin("uluna", 2))] }
  const gas = useGas(simMsg)
  const gasPrice = useGasPrice()
  const taxRate = useTaxRate()
  const finalgas = gas && (connected.network === "classic" ? taxRate && (gas * gasPrice + amount * 1000000 * taxRate).toFixed(0) : (gas * gasPrice).toFixed(0))

  const { post } = useWallet()
  const msg = { chainID: chainID, msgs: [new MsgDelegate(connected?.addresses[chainID], validator.operator_address, new Coin("uluna", amount * 1000000))] }

  const remainingBalance = (station.data.bank.balance.use()?._coins.uluna?.amount.toString() / 1000000 || 0) - (amount || 0)

  return (
    <>
      <Html position={[0, 75, 0]} style={{ fontSize: 40 }} pointerEvents='auto'>
        <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "700px", fontWeight: "bold" }}>{validator?.description.moniker}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <span>Amount: </span>
          <input
            style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
            type='numeric'
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            maxLength='10'
            size='15'
          />
          <p>
            Fee: <b>{<AnimatedText text={finalgas ? (finalgas / 1000000).toString() : "Calculating..."} chars={"0123456789"} speed={20} />}</b> LUNA
          </p>
          <p>
            Balance after Tx: <b>{remainingBalance.toFixed(2)}</b> LUNA
          </p>
        </div>
      </Html>
      <Button
        text='Delegate'
        position={[0, -120, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}

function Undelegate() {
  const validator = station.Stake.validator.use()
  const delegations = station.data.stake.delegations.use()

  const [amount, setAmount] = useState("")
  const connected = useConnectedWallet()
  const chainID = connected ? getChainID(connected.network) : "phoenix-1"

  const simMsg = { chainID: chainID, msgs: [new MsgUndelegate(connected?.addresses[chainID], validator.operator_address, new Coin("uluna", 2))] }
  const gas = useGas(simMsg)
  const gasPrice = useGasPrice()
  const taxRate = useTaxRate()
  const finalgas = gas && (connected.network === "classic" ? taxRate && (gas * gasPrice + amount * 1000000 * taxRate).toFixed(0) : (gas * gasPrice).toFixed(0))

  const { post } = useWallet()
  const msg = { chainID: chainID, msgs: [new MsgUndelegate(connected?.addresses[chainID], validator.operator_address, new Coin("uluna", amount * 1000000))] }

  const delegated = delegations?.filter(({ validator_address }) => validator?.operator_address === validator_address)[0]?.shares.toString() / 1000000
  const remainingBalance = (delegated || 0) - (amount || 0)

  return (
    <>
      <Html position={[0, 75, 0]} style={{ fontSize: 40 }} pointerEvents='auto'>
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "700px", fontWeight: "bold" }}>{validator?.description.moniker}</p>
        <span>Amount: </span>
        <input
          style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
          type='numeric'
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          maxLength='10'
          size='15'
        />
        <p>
          Fee: <b>{<AnimatedText text={finalgas ? (finalgas / 1000000).toString() : "Calculating..."} chars={"0123456789"} speed={20} />}</b> LUNA
        </p>
        <p>
          Remaining: <b>{remainingBalance.toFixed(2)}</b> LUNA
        </p>
      </Html>
      <Button
        text='Undelegate'
        position={[0, -120, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}

function Redelegate() {
  const validator = station.Stake.validator.use()
  const validators = station.data.stake.validators.use()
  const delegations = station.data.stake.delegations.use()

  const defaultValue = delegations?.filter(({ balance, validator_address }) => balance.amount.toString() > 0 && validator?.operator_address !== validator_address)[0]?.validator_address
  const [selected, setSelected] = useState(defaultValue)

  const [amount, setAmount] = useState("")
  const connected = useConnectedWallet()
  const chainID = connected ? getChainID(connected.network) : "phoenix-1"

  const simMsg = { chainID: chainID, msgs: [new MsgBeginRedelegate(connected?.addresses[chainID], selected, validator.operator_address, new Coin("uluna", 2))] }
  const gas = useGas(simMsg)
  const gasPrice = useGasPrice()
  const taxRate = useTaxRate()
  const finalgas = gas && (connected.network === "classic" ? taxRate && (gas * gasPrice + amount * 1000000 * taxRate).toFixed(0) : (gas * gasPrice).toFixed(0))

  const { post } = useWallet()
  const msg = { chainID: chainID, msgs: [new MsgBeginRedelegate(connected?.addresses[chainID], selected, validator.operator_address, new Coin("uluna", amount * 1000000))] }

  const delegated = delegations?.filter(({ validator_address }) => selected === validator_address)[0]?.shares.toString() / 1000000
  const remainingBalance = (delegated || 0) - (amount || 0)

  return (
    <>
      <Html position={[0, 75, 0]} style={{ fontSize: 40 }} pointerEvents='auto'>
        <p>
          <span>From: </span>
          <select
            onChange={(e) => setSelected(e.target.value)}
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: station.Hud.text.color.use(),
              backgroundColor: "black",
              fontFamily: "Alien League",
              borderRadius: "15px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "400px",
            }}
          >
            {delegations
              ?.filter(({ balance, validator_address }) => balance.amount.toString() > 0 && validator?.operator_address !== validator_address)
              .map((d, i) => (
                <option value={d.validator_address} key={i}>
                  {validators?.find((v) => v.operator_address === d.validator_address)?.description.moniker.substring(0, 25)}
                </option>
              ))}
          </select>
        </p>
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "500px" }}>
          To: <b>{validator?.description.moniker}</b>
        </p>
        <span>Amount: </span>
        <input
          style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
          type='numeric'
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          maxLength='10'
          size='15'
        />
        <p>
          Fee: <b>{<AnimatedText text={finalgas ? (finalgas / 1000000).toString() : "Calculating..."} chars={"0123456789"} speed={20} />}</b> LUNA
        </p>
        <p>
          Remaining: <b>{remainingBalance.toFixed(2)}</b> LUNA
        </p>
      </Html>
      <Button
        text='Redelegate'
        position={[0, -180, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}

function VotingHistory() {
  const validator = station.Stake.validator.use()
  const lcd = useLcdClient()
  const connected = useConnectedWallet()
  const chainID = connected ? getChainID(connected.network) : "phoenix-1"
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
      {position < 2 && <Title text='Voting History' />}
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

const getChainID = (network) => {
  switch (network) {
    case "mainnet":
      return "phoenix-1"
    case "testnet":
      return "pisco-1"
    case "classic":
      return "columbus-5"
    case "localterra":
      return "localterra"
  }
}
