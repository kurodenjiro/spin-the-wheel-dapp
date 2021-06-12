import { forwardRef, useImperativeHandle, useState } from 'react'
import { CaretDownFill } from 'react-bootstrap-icons'
import spinToWinImg from '../assets/spin-to-win.png'
import { randomInt } from '../utils/random'
import { sleep } from '../utils/time'

type Props = {
  prizes: string[]
}

export type WheelRef = {
  spinToIndex: (index: number, duration: number) => Promise<void>
}

const SECTOR_COLORS = [
  '#19C0FC',
  '#EC0E24',
  '#28B046',
  '#0453EA',
  '#EE2F0B',
  '#881391',
]

export const Wheel = forwardRef<WheelRef, Props>(({ prizes }, ref) => {
  const radius = 250
  const width = radius * 2, height = radius * 2
  const sectorSize = 360 / prizes.length

  const [angle, setAngle] = useState(0)
  const [duration, setDuration] = useState(0) // seconds

  useImperativeHandle(ref, () => ({
    async spinToIndex(index, duration) {
      const desiredAngle = sectorSize * index - sectorSize / 2 +
        Math.random() * sectorSize + 360 * randomInt(5, 8)
      // Reset angle (angle % 360 == 0) and add desiredAngle
      setAngle(a => a - a % 360 + 360 + desiredAngle)
      setDuration(duration)
      await sleep(duration * 1000)
    },
  }))

  const arrowSize = radius / 6
  const outlineCircleStrokeWidth = 15
  const strokeColor = '#F1D585'
  return (
    <div style={{ overflow: 'hidden', position: 'relative', width, height }}>
      <div style={{ position: 'absolute', zIndex: 2 }}>
        <CaretDownFill
          width={width}
          x={radius}
          fill={strokeColor}
          size={arrowSize}
        />
      </div>
      <svg
        width={width} height={height}
        style={{
          transition: `all ${duration}s cubic-bezier(0.3,-0.05,0,1)`,
          transform: `rotate(${-angle}deg)`,
        }}
      >
        <g transform={`translate(${radius}, ${radius})`}>
          <g strokeWidth="2">
            {prizes.map((prize, i) => {
              const color = SECTOR_COLORS[i % SECTOR_COLORS.length]
              return (
                <g
                  key={`${prize}${i}`}
                  transform={`rotate(${-90 + i * sectorSize})`}
                >
                  <path
                    stroke={strokeColor}
                    strokeWidth="2"
                    fill={color}
                    d={getSectorPath(0, 0, radius, -sectorSize / 2, sectorSize - sectorSize / 2)}
                  />
                  <text
                    x={radius * 0.5}
                    y={radius / 8 * 0.4}  // Relative to fontSize
                    fontSize={radius / 8}
                    fill="white"
                  >
                    {prize}
                  </text>
                </g>
              )
            })}
          </g>
          <circle
            cx="0"
            cy="0"
            r={radius - outlineCircleStrokeWidth / 2}
            strokeWidth={outlineCircleStrokeWidth}
            stroke={strokeColor}
            fill="transparent"
          />
          <image
            xlinkHref={spinToWinImg}
            width={width}
            height={height}
            x={-radius}
            y={-radius}
            transform="scale(0.4)"
          />
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
