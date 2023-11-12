import { lazy, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { WalletProvider } from "@terra-money/wallet-kit"

const World = lazy(() => import("./world/World.jsx"))
const Hud = lazy(() => import("./hud/Hud.jsx"))

export default function App() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <Canvas>
          <Suspense>
            <World />
          </Suspense>
          <Suspense>
            <WalletProvider>
              <Hud />
            </WalletProvider>
          </Suspense>
        </Canvas>
      </div>
      <Background />
    </>
  )
}

function Background() {
  const color = "black"

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: color,
        zIndex: -1,
      }}
    ></div>
  )
}
