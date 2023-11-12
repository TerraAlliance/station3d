import { useState } from "react"

import { useConnectedWallet, useWallet } from "@terra-money/wallet-kit"

import { MsgDelegate, MsgBeginRedelegate, MsgUndelegate, Coin, Coins, Fee } from "@terra-money/feather.js"

import AnimatedText from "../../gui/AnimatedText"

import Html from "../../gui/Html"
import Button from "../../gui/Button"

import { useGas, useTaxRate, useGasPrice } from "../../../queries"

import { station } from "../../../state"

export function Delegate() {
  const validator = station.Stake.validator.use()

  const [amount, setAmount] = useState("")
  const connected = useConnectedWallet()
  const chainID = station.chainID.use()

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
      <Html position={[0, 75, 0]} style={{ fontSize: 40 }} pointerEvents="auto">
        <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "700px", fontWeight: "bold" }}>{validator?.description.moniker}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <span>Amount: </span>
          <input
            style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
            type="number"
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            maxLength="10"
            size="15"
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
        text="Delegate"
        position={[0, -120, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}

export function Undelegate() {
  const validator = station.Stake.validator.use()
  const delegations = station.data.stake.delegations.use()

  const [amount, setAmount] = useState("")
  const connected = useConnectedWallet()
  const chainID = station.chainID.use()

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
      <Html position={[0, 75, 0]} style={{ fontSize: 40 }} pointerEvents="auto">
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "700px", fontWeight: "bold" }}>{validator?.description.moniker}</p>
        <span>Amount: </span>
        <input
          style={{ fontSize: 40, fontFamily: "Alien League", fontWeight: "bold", color: station.Hud.text.color.use(), backgroundColor: remainingBalance > 0 ? "black" : "red", borderRadius: "15px" }}
          type="number"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          maxLength="10"
          size="15"
        />
        <p>
          Fee: <b>{<AnimatedText text={finalgas ? (finalgas / 1000000).toString() : "Calculating..."} chars={"0123456789"} speed={20} />}</b> LUNA
        </p>
        <p>
          Remaining: <b>{remainingBalance.toFixed(2)}</b> LUNA
        </p>
      </Html>
      <Button
        text="Undelegate"
        position={[0, -120, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}

export function Redelegate() {
  const validator = station.Stake.validator.use()
  const validators = station.data.stake.validators.use()
  const delegations = station.data.stake.delegations.use()

  const defaultValue = delegations?.filter(({ balance, validator_address }) => balance.amount.toString() > 0 && validator?.operator_address !== validator_address)[0]?.validator_address
  const [selected, setSelected] = useState(defaultValue)

  const [amount, setAmount] = useState("")
  const connected = useConnectedWallet()
  const chainID = station.chainID.use()

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
      <Html position={[0, 75, 0]} style={{ fontSize: 40 }} pointerEvents="auto">
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
          type="number"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
          maxLength="10"
          size="15"
        />
        <p>
          Fee: <b>{<AnimatedText text={finalgas ? (finalgas / 1000000).toString() : "Calculating..."} chars={"0123456789"} speed={20} />}</b> LUNA
        </p>
        <p>
          Remaining: <b>{remainingBalance.toFixed(2)}</b> LUNA
        </p>
      </Html>
      <Button
        text="Redelegate"
        position={[0, -180, 0]}
        scale={35}
        onClick={() => amount > 0 && remainingBalance > 0 && finalgas && post({ ...msg, fee: new Fee(gas, new Coins([new Coin("uluna", finalgas)])) })}
      />
    </>
  )
}
