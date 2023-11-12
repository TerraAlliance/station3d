import { useEffect } from "react"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { Vector3, MeshStandardMaterial } from "three"

import { station } from "../../../state"

export default function VotingBar({ position, proposal, length, radius, quorum }) {
  const lcd = station.lcd.use()
  const staked = station.data.stake.total.use()
  const chainID = station.chainID.use()
  const tally = station.data.govern[proposal?.id].tally.use()

  useEffect(() => {
    proposal && lcd.gov.tally(proposal?.id, chainID).then((tally) => station.data.govern[proposal.id].tally.set(tally))
  }, [])

  const yeslength = (tally?.yes.toString() / staked) * length
  const nolength = (tally?.no.toString() / staked) * length
  const vetolength = (tally?.no_with_veto.toString() / staked) * length
  const abstainlength = (tally?.abstain.toString() / staked) * length
  const voteslength = yeslength + nolength + vetolength + abstainlength

  var trackMaterial = new CustomShaderMaterial({
    baseMaterial: new MeshStandardMaterial({ metalness: 1, roughness: 0.15 }),
    uniforms: {
      bboxMin: {
        value: new Vector3(0, (yeslength + nolength + vetolength + abstainlength) / 2, 0),
      },
      bboxMax: {
        value: new Vector3(0, -(yeslength + nolength + vetolength + abstainlength) / 2, 0),
      },
      yesPercentage: { value: yeslength / voteslength },
      noPercentage: { value: nolength / voteslength },
      vetoPercentage: { value: vetolength / voteslength },
      abstainPercentage: { value: abstainlength / voteslength },
    },
    vertexShader: `
    uniform vec3 bboxMin;
    uniform vec3 bboxMax;
  
    varying vec2 vUv;

    void main() {
      vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;

    uniform float yesPercentage;
    uniform float noPercentage;
    uniform float vetoPercentage;
    uniform float abstainPercentage;

    void main() {
      vec3 color = vec3(0.0);
    if (vUv.y < yesPercentage) {
        color = vec3(0.0, 1.0, 0.0);  // Green (RGB)
    } else if (vUv.y < (yesPercentage + noPercentage)) {
        color = vec3(1.0, 0.0, 0.0);  // Red (RGB)
    } else if (vUv.y < (yesPercentage + noPercentage + vetoPercentage)) {
        color = vec3(1.0, 0.5, 0.0);  // Orange (RGB)
    } else if (vUv.y < (yesPercentage + noPercentage + vetoPercentage + abstainPercentage)) {
        color = vec3(1.0, 1.0, 0.0);  // Yellow (RGB)
    }
    csm_DiffuseColor = vec4(color, 1.0);
    }
  `,
    silent: true,
    transparent: true,
  })

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <capsuleGeometry args={[radius, length - radius * 2]} />
        <meshStandardMaterial transparent={true} opacity={0.3} color={"white"} depthWrite={false} />
      </mesh>
      <mesh position={[-length / 2 + length * quorum, radius * 2.5, 0]} rotation={[0, 0, Math.PI]} scale={5}>
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} />
        <coneGeometry args={[1, 3]} />
      </mesh>
      {tally && (
        <mesh material={trackMaterial} position={[(-length + yeslength + nolength + vetolength + abstainlength) / 2, 0, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
          <capsuleGeometry args={[radius, yeslength + nolength + vetolength + abstainlength - radius * 2]} />
        </mesh>
      )}
    </group>
  )
}
