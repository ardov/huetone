import './styles.css'
import { useEffect, useRef } from 'react'
import { displayable, MAX_C, MAX_H, MAX_L, toHex } from '../color'
import { LCH } from '../types'
import styled from 'styled-components'

type Axis = 'l' | 'c' | 'h'

const scales = {
  l: [MAX_L, 0] as [number, number],
  c: [MAX_C, 0] as [number, number],
  h: [MAX_H, 0] as [number, number],
}

type ScaleProps = {
  colors: LCH[]
  axis: Axis
  height?: number
  width?: number
  onColorChange: (idx: number, value: LCH) => void
}

export function Scale({
  colors,
  axis = 'l',
  height = 120,
  width = 360,
  onColorChange,
}: ScaleProps) {
  if (!colors?.length) return null
  const sectionWidth = width / colors.length
  return (
    <div
      style={{
        width: width,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,
      }}
    >
      <div style={{ display: 'flex' }}>
        {colors.map(lch => (
          <div
            style={{
              background: toHex(lch),
              height: 10,
              flexGrow: 1,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          position: 'relative',
          padding: 0,
          margin: 0,
          lineHeight: 0,
        }}
      >
        <Canvas
          width={sectionWidth / 2}
          height={height}
          axis={axis}
          color1={colors[0]}
          color2={colors[0]}
        />
        {colors.map((color, i) => (
          <Canvas
            width={i + 1 < colors.length ? sectionWidth : sectionWidth / 2}
            height={height}
            axis={axis}
            color1={color}
            color2={i + 1 < colors.length ? colors[i + 1] : color}
          />
        ))}

        {colors.map((lch, i) => {
          return (
            <Knob
              key={i}
              type="range"
              // orient="vertical"
              min={0}
              max={axis === 'l' ? MAX_L : axis === 'c' ? MAX_C : MAX_H}
              value={axis === 'l' ? lch[0] : axis === 'c' ? lch[1] : lch[2]}
              onChange={e => {
                const [l, c, h] = lch
                const value = +e.target.value
                if (axis === 'l') onColorChange(i, [value, c, h])
                if (axis === 'c') onColorChange(i, [l, value, h])
                if (axis === 'h') onColorChange(i, [l, c, value])
              }}
              onDoubleClick={() => alert('123')}
              color={toHex(lch)}
              canvasHeight={height}
              left={sectionWidth * i + sectionWidth / 2}
            />
          )
        })}
      </div>
    </div>
  )
}

const Knob = styled.input<{
  color: string
  canvasHeight: number
  left: number
}>`
  --bg: ${p => p.color};
  height: 1px;
  width: ${p => p.canvasHeight + 16}px;
  position: absolute;
  bottom: -8px;
  left: ${p => p.left}px;
  transform: translateX(0.5px) rotate(-90deg);
  transform-origin: bottom left;
`

function Canvas(props: {
  width: number
  height: number
  axis: Axis
  color1: LCH
  color2: LCH
}) {
  const { width, height, axis, color1, color2 } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const paint = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const intWidth = Math.ceil(width)
    const intHeight = Math.ceil(height)
    const size = intWidth * intHeight * 4
    const pixels = new Uint8ClampedArray(size)

    for (let x = 0; x < intWidth; x++) {
      for (let y = 0; y < intHeight; y++) {
        const l =
          axis === 'l'
            ? scaleValue(y, [0, intHeight], scales.l)
            : scaleValue(x, [0, intWidth], [color1[0], color2[0]])
        const c =
          axis === 'c'
            ? scaleValue(y, [0, intHeight], scales.c)
            : scaleValue(x, [0, intWidth], [color1[1], color2[1]])
        const h =
          axis === 'h'
            ? scaleValue(y, [0, intHeight], scales.h)
            : scaleValue(x, [0, intWidth], [color1[2], color2[2]])

        const [r, g, b] = displayable([l, c, h])
          ? [255, 255, 255]
          : [210, 210, 210]

        const displacement = y * intWidth * 4 + x * 4
        pixels[displacement] = r
        pixels[displacement + 1] = g
        pixels[displacement + 2] = b
        pixels[displacement + 3] = 255
      }
    }

    const imageData = new ImageData(pixels, intWidth, intHeight)
    ctx?.putImageData(imageData, 0, 0)
  }

  useEffect(paint, [axis, color1, color2, height, width])
  return <canvas ref={canvasRef} width={width} height={height} />
}

function scaleValue(
  value: number,
  from: [number, number],
  to: [number, number]
) {
  var scale = (to[1] - to[0]) / (from[1] - from[0])
  var capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return capped * scale + to[0]
}
