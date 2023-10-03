import { lazy, Suspense } from "react"
import { Hud as _Hud, OrthographicCamera } from "@react-three/drei"

import { station } from "../state"
station.Hud.event.set("Home")
station.volume.set(0.2)

const Navigation = lazy(() => import("./sidebars/Navigation"))
const SideWallet = lazy(() => import("./sidebars/SideWallet"))
const Home = lazy(() => import("./pages/Home"))
const Swap = lazy(() => import("./pages/Swap"))
const Wallet = lazy(() => import("./pages/wallet/Wallet"))
const Stake = lazy(() => import("./pages/stake/Stake"))
const Burn = lazy(() => import("./pages/Burn"))
const Govern = lazy(() => import("./pages/govern/Govern"))
const Theme = lazy(() => import("./pages/Theme"))

import { useQueries, useInterchainLCDClient } from "../queries"

export default function Hud() {
  useInterchainLCDClient()
  useQueries()
  return (
    <>
      <_Hud>
        <OrthographicCamera makeDefault position={[0, 0, 1000]} far={10000} />
        <pointLight decay={0} distance={13000} intensity={30} position={[0, 0, 10000]} />
        <pointLight decay={0} distance={6000} intensity={25} position={[0, -2000, -7000]} />
        <Pages />
      </_Hud>
    </>
  )
}

function Pages() {
  return (
    <>
      <Suspense>
        <Navigation />
      </Suspense>
      {!("ontouchstart" in document.documentElement) && (
        <Suspense>
          <SideWallet />
        </Suspense>
      )}
      <Suspense>
        <Home />
      </Suspense>
      <Suspense>
        <Swap />
      </Suspense>
      <Suspense>
        <Wallet />
      </Suspense>
      <Suspense>
        <Burn />
      </Suspense>
      <Suspense>
        <Stake />
      </Suspense>
      <Suspense>
        <Govern />
      </Suspense>
      <Suspense>
        <Theme />
      </Suspense>
    </>
  )
}
