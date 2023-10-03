import { Suspense, useState } from "react"
import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit"
import { MsgSend, Coin, Coins, Fee } from "@terra-money/feather.js"

import AnimatedText from "../../gui/AnimatedText"

import Html from "../../gui/Html"
import Lunc from "../../coins/Lunc"
import Ibc from "../../coins/Ibc"
import Terra from "../../coins/Terra"
import { useGas, useTaxRate, useGasPrice } from "../../../queries"
import { station } from "../../../state"
import Button from "../../gui/Button"

export default function Send() {
  const balance = station.data.bank.balance.use()

  const coinArray = Object.values(balance?._coins || {})
  coinArray.sort((a, b) => Number(b.amount) - Number(a.amount))

  const [scroll, setScroll] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [to, setTo] = useState()

  const selectedBalance = Math.floor((coinArray[scroll]?.amount / 1000000) * 100) / 100

  const connected = useConnectedWallet()
  const [amount, setAmount] = useState()
  const chainID = connected ? getChainID(connected.network) : "phoenix-1"
  const simMsg = { chainID: chainID, msgs: [new MsgSend(connected?.addresses[chainID], connected?.addresses[chainID], new Coins([new Coin(coinArray[scroll]?.denom, 2)]))] }

  const gas = useGas(simMsg)

  const gasPrice = useGasPrice()
  const taxRate = useTaxRate()
  const finalgas = gas && (connected.network === "classic" ? taxRate && (gas * gasPrice + (amount || 0) * 1000000 * taxRate).toFixed(0) : (gas * gasPrice).toFixed(0))

  const msg = { chainID: chainID, msgs: [new MsgSend(connected?.addresses[chainID], to, new Coins([new Coin(coinArray[scroll].denom, amount * 1000000)]))] }

  return (
    <>
      <group position={[0, 0, 0]}>
        {coinArray.map((c, i) => (
          <>
            {(i - scroll === 0 || hovered) && <Coin3D key={i} Component={c.denom === "uluna" ? Lunc : c.denom.slice(0, 3) === "ibc" ? Ibc : Terra} index={i} scroll={scroll} flag={c.denom.slice(1)} />}
          </>
        ))}
      </group>
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        visible={false}
        onWheel={(ev) => setScroll((prev) => Math.max(Math.min(prev + Math.sign(ev.deltaY), coinArray.length - 1), 0))}
      >
        <sphereGeometry args={[130, 32, 32]} />
        <meshStandardMaterial transparent={true} opacity={0.4} />
      </mesh>
      <Form coinArray={coinArray} selectedBalance={selectedBalance} amount={amount} setAmount={setAmount} to={to} setTo={setTo} finalgas={finalgas} msg={msg} gas={gas} scroll={scroll} />
    </>
  )
}

function Form({ coinArray, selectedBalance, amount, setAmount, to, setTo, finalgas, msg, gas, scroll }) {
  const remainingBalance = (station.data.bank.balance.use()?._coins[coinArray[scroll]?.denom].amount.toString() / 1000000 || 0) - (amount || 0)
  const connected = useConnectedWallet()
  const { post } = useWallet()

  return (
    <>
      <Html style={{ textAlign: "center", fontSize: 40 }} position={[0, 180, 0]} pointerEvents={"auto"}>
        <p style={{ fontSize: 40, margin: 0 }}>
          <b>{coinArray[scroll]?.amount ? <AnimatedText text={selectedBalance.toString()} chars={"0123456789"} speed={20} /> : <AnimatedText text={"0"} chars={"0123456789"} speed={20} />}</b>
          <span style={{ marginTop: 15 }}>{" " + (coinArray[scroll]?.denom === "uluna" ? (connected?.network === "classic" ? "lunc" : "luna") : coinArray[scroll]?.denom.substring(0, 10))}</span>
        </p>
      </Html>
      <Html style={{ textAlign: "center", fontSize: 40 }} position={[0, -260, 0]} pointerEvents={"auto"}>
        <span>Amount: </span>
        <input
          style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
          type="number"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          maxLength="10"
          size="15"
        />
        <p style={{ margin: "20px" }}>
          <span>To: </span>
          <input
            style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
            type="text"
            value={to}
            onChange={(ev) => setTo(ev.target.value)}
            maxLength="44"
            size="20"
            spellcheck="false"
          />
        </p>
        <p style={{ margin: "20px" }}>
          Fee: <b>{<AnimatedText text={finalgas ? (finalgas / 1000000).toString() : "Calculating..."} chars={"0123456789"} speed={20} />}</b> LUNA
        </p>
      </Html>
      <Button
        text="Send"
        position={[0, -370, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && to && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}

const currencies = ["usd", "twd", "thb", "sgd", "sek", "sdr", "php", "nok", "myr", "mnt", "krw", "jpy", "inr", "idr", "hkd", "gbp", "eur", "dkk", "cny", "chf", "cad", "aud"]

function Coin3D({ Component, flag, index, scroll }) {
  const v = index - scroll
  let x = v * 110
  let y = v * v * 40
  x = v === 0 ? x : v > 0 ? x + 110 : x - 110
  y = v === 0 ? y : v > 0 ? y + 40 : y + 40

  return (
    <group position={[x, y, 0]}>
      <Suspense>
        <Component position={[0, 0, 0]} scale={index === scroll ? 130 : 50} flag={currencies.indexOf(flag)} />
      </Suspense>
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
