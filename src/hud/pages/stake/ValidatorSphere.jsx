import { useRef } from "react"
import { SphereGeometry, MeshStandardMaterial } from "three"
import { useFrame } from "@react-three/fiber"
import { Html as _Html } from "@react-three/drei"

import { station } from "../../../state"

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

export default function ValidatorSphere({ validators, sort, play }) {
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
          <ValidatorSpheres validator={v} index={i} key={i} play={play} totalValidators={validators.length - 1} />
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
