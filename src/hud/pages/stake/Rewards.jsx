import { Suspense } from "react"
import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit"
import { useWindowSize } from "@uidotdev/usehooks"
import { MsgWithdrawDelegatorReward } from "@terra-money/feather.js"
import { Coin, Coins, Fee } from "@terra-money/feather.js"

import AnimatedText from "../../gui/AnimatedText"
import Html from "../../gui/Html"
import Button from "../../gui/Button"
import Terra from "../../coins/Terra"
import Lunc from "../../coins/Lunc"
import { useGas, useGasPrice } from "../../../queries"

import { station } from "../../../state"

const touch = "ontouchstart" in document.documentElement

export default function Rewards() {
  const columns = touch ? 1 : 4
  const xspacing = 175
  const yspacing = 130
  const scroll = station.Hud.Stake.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns

  const rewards = station.data.distribution.rewards.use()
  const coinArray = Object.values(rewards?.total._coins || {})
  coinArray.sort((a, b) => Number(b.amount) - Number(a.amount)).filter((c) => Number(c.amount) !== 0)

  return (
    <>
      <WithdrawRewards />
      {coinArray
        ?.slice(0, position + 24)
        .map(
          (c, i) =>
            i >= position - 12 && (
              <Asset
                key={i}
                Component={c.denom === "uluna" ? Lunc : Terra}
                position={[0, i * -90 + 250, 0]}
                currency={c.denom}
                coin={c}
                flag={c.denom.slice(1)}
                xspacing={xspacing}
                yspacing={yspacing}
                index={i}
                columns={columns}
              />
            )
        )}
    </>
  )
}

function WithdrawRewards() {
  const size = useWindowSize()
  const connected = useConnectedWallet()
  const chainID = connected ? getChainID(connected.network) : "phoenix-1"
  const rewards = station.data.distribution.rewards.use()

  const validators = rewards && Object.keys(rewards.rewards).filter((address) => rewards.rewards[address]._coins.uluna?.amount.toString() >= 1)

  const msg = { chainID: chainID, msgs: validators?.map((address) => new MsgWithdrawDelegatorReward(connected?.addresses[chainID], address)) }
  const gas = useGas(msg)
  const gasPrice = useGasPrice()

  const { post } = useWallet()

  return (
    <group position={[0, size.height / 2 - 215, 0]}>
      <FeeText gas={gas} gasPrice={gasPrice} />
      <Button
        text="Withdraw All Rewards"
        position={[0, 0, 0]}
        scale={35}
        selectedColor="yellow"
        onClick={() => post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", (gas * gasPrice).toFixed(0))])) })}
      />
    </group>
  )
}

function FeeText({ gas, gasPrice }) {
  const feetext = gas ? ((gas * gasPrice) / 1000000).toFixed(6).toString() : "Calculating..."

  return (
    <Html position={[0, -70, 0]} style={{ fontSize: 40 }}>
      <p>
        Fee: <b>{<AnimatedText text={feetext} chars={"0123456789"} speed={20} />}</b> LUNA
      </p>
    </Html>
  )
}

const currencies = ["usd", "twd", "thb", "sgd", "sek", "sdr", "php", "nok", "myr", "mnt", "krw", "jpy", "inr", "idr", "hkd", "gbp", "eur", "dkk", "cny", "chf", "cad", "aud"]

function Asset({ Component, coin, index, columns, xspacing, yspacing, flag, currency }) {
  const size = useWindowSize()
  const show = true
  const connected = useConnectedWallet()
  const coinBalance = Math.floor((coin.amount / 1000000) * 1000000) / 1000000

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 400, 0]}>
      <Suspense>
        <Component position={[0, 0, 0]} scale={30} flag={currencies.indexOf(flag) > 0 ? currencies.indexOf(flag) : null} animate />
      </Suspense>
      <Html transform distanceFactor={400} style={{ width: "150px", textAlign: "left" }} position={[50, -60, 0]} pointerEvents="none">
        <span style={{ fontSize: 26 }}>
          <b>
            {coinBalance ? <AnimatedText text={show ? coinBalance.toString() : "---"} chars={"0123456789"} speed={20} /> : <AnimatedText text={show ? "0" : "---"} chars={"0123456789"} speed={20} />}
          </b>
        </span>
        <span
          style={{
            fontSize: 20,
            whiteSpace: "nowrap",
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "90px",
            display: "block",
          }}
        >
          {" " + (coin.denom === "uluna" ? (connected?.network === "classic" ? "lunc" : "luna") : currency)}
        </span>
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
