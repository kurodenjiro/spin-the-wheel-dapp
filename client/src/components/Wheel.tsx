import BN from 'bn.js'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { ArrowDown } from 'react-bootstrap-icons'
import { sha3 } from 'web3-utils'

type Props = {
  prizes: number[]
}

export type WheelRef = {
  spinToIndex: (index: number) => void
}

export const Wheel = forwardRef<WheelRef, Props>(({ prizes }, ref) => {
  const radius = 250
  const sectorSize = 360 / prizes.length

  const [angle, setAngle] = useState(0)
  const duration = 5 // seconds

  useImperativeHandle(ref, () => ({
    spinToIndex(index: number) {
      const desiredAngle = sectorSize * index + sectorSize / 2 +
        Math.random() * sectorSize + 360 * Math.floor(Math.random() * 6)
      // Reset angle (angle % 360 == 0) and add desiredAngle
      setAngle(a => a - a % 360 + 360 + desiredAngle)
    },
  }))

  const arrowSize = radius / 6
  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', top: arrowSize * 0.3, zIndex: 2 }}>
        <ArrowDown
          width={radius * 2}
          height={arrowSize}
          x={radius}
          size={arrowSize}
          style={{ transform: 'rotate(6deg)' }}
        />
      </div>
      <svg
        width={radius * 2} height={radius * 2}
        style={{
          transition: `all ${duration}s cubic-bezier(0.3,-0.05,0,1)`,
          transform: `rotate(${angle}deg)`,
        }}
      >
        <g transform={`translate(${radius}, ${radius})`} strokeWidth="2">
          {prizes.map((prize, i) => {
            const color = '#' + new BN(sha3(i.toString())!).toString('hex').substring(0, 6)
            return (
              <g
                key={i}
                transform={`rotate(${-90 + i * sectorSize})`}
              >
                <path
                  stroke="black"
                  strokeWidth="2"
                  fill={color}
                  d={getSectorPath(0, 0, radius, -sectorSize / 2, sectorSize - sectorSize / 2)}
                />
                <text
                  rotate={90}
                  x={radius * 0.6}
                  fontSize={radius / 8}
                >
                  {prize}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
})

function getSectorPath(x: number, y: number, radius: number, a1: number, a2: number) {
  const degtorad = Math.PI / 180
  const cr = radius - 5
  const cx1 = (Math.cos(degtorad * a2) * cr) + x
  const cy1 = (-Math.sin(degtorad * a2) * cr) + y
  const cx2 = (Math.cos(degtorad * a1) * cr) + x
  const cy2 = (-Math.sin(degtorad * a1) * cr) + y

  return 'M' + x + ' ' + y + ' ' + cx1 + ' ' + cy1 + ' A' + cr + ' ' + cr + ' 0 0 1 ' + cx2 + ' ' + cy2 + 'Z'
}
