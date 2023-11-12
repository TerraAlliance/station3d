import { Suspense } from "react"
import { useWindowSize } from "@uidotdev/usehooks"
import { useConnectedWallet } from "@terra-money/wallet-kit"

import AnimatedText from "../../gui/AnimatedText"

import Html from "../../gui/Html"
import Lunc from "../../coins/Lunc"
import Ibc from "../../coins/Ibc"
import Terra from "../../coins/Terra"
import { station } from "../../../state"

export default function Assets() {
  const columns = "ontouchstart" in document.documentElement ? 1 : 5
  const xspacing = 175
  const yspacing = 130
  const scroll = station.Hud.Wallet.scroll.use()
  const position = Math.round(((scroll / yspacing) * columns) / columns) * columns

  const balance = station.data.bank.balance.use()
  const coinArray = Object.values(balance?._coins || {})
  coinArray.sort((a, b) => Number(b.amount) - Number(a.amount))

  return (
    <>
      {coinArray
        ?.slice(0, position + 30)
        .map(
          (c, i) =>
            i >= position - 5 && (
              <Coin
                key={i}
                Component={c.denom === "uluna" ? Lunc : c.denom.slice(0, 3) === "ibc" ? Ibc : Terra}
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

const currencies = ["usd", "twd", "thb", "sgd", "sek", "sdr", "php", "nok", "myr", "mnt", "krw", "jpy", "inr", "idr", "hkd", "gbp", "eur", "dkk", "cny", "chf", "cad", "aud"]

function Coin({ Component, coin, index, columns, xspacing, yspacing, flag, currency }) {
  const size = useWindowSize()
  const show = true
  const connected = useConnectedWallet()
  const coinBalance = Math.floor((coin.amount / 1000000) * 100) / 100

  return (
    <group position={[(index % columns) * xspacing - ((columns - 1) * xspacing) / 2, -Math.floor(index / columns) * yspacing + size.height / 2 - 250, 0]}>
      <Suspense>
        <Component position={[0, 0, 0]} scale={30} flag={currencies.indexOf(flag) > 0 ? currencies.indexOf(flag) : null} animate />
      </Suspense>
      <Html transform distanceFactor={400} style={{ width: "150px", textAlign: "left" }} position={[50, -60, 0]} pointerEvents='none'>
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
