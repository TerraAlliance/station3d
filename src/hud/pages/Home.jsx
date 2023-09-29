import { useConnectedWallet } from "@terra-money/wallet-kit"

import { station } from "../../state"

import AnimatedPage from "../gui/AnimatedPage"
import Lunc from "../coins/Lunc"
import Luna from "../coins/Luna"

export default function Home() {
  return <AnimatedPage name='Home'>{station.Hud.Home.active.use() && <Main />}</AnimatedPage>
}

function Main() {
  const connected = useConnectedWallet()

  return <>{getCoin3d(connected?.network || "mainnet")}</>
}

const getCoin3d = (network) => {
  switch (network) {
    case "mainnet":
      return <Luna scale={130} />
    case "testnet":
      return <Luna scale={130} />
    case "classic":
      return <Lunc scale={130} />
    case "localterra":
      return <Luna scale={130} />
  }
}
