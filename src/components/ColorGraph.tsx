import './styles.css'
import { useEffect, useMemo, useRef } from 'react'
import { getMostContrast, MAX_C, MAX_H, MAX_L, toHex } from '../color'
import { Channel, LCH } from '../types'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { drawChart } from './Chart/draw'

const channelIndexes = { l: 0, c: 1, h: 2 }
const channelNames = {
  l: 'Lightness',
  c: 'Chroma a.k.a. saturation',
  h: 'Hue',
}

type ScaleProps = {
  colors: LCH[]
  channel: Channel
  height?: number
  width?: number
  onColorChange: (idx: number, value: LCH) => void
}

export function Scale({
  colors,
  channel = 'l',
  height = 150,
  width = 400,
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
      }}
    >
      {channelNames[channel]}
      <div style={{ display: 'flex' }}>
        {colors.map((lch, i) => (
          <Value key={i} color={toHex(lch)}>
            {+lch[channelIndexes[channel]].toFixed(1)}
          </Value>
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
          width={width}
          height={height}
          channel={channel}
          colors={colors}
        />

        {colors.map((lch, i) => {
          return (
            <Knob
              key={i}
              type="range"
              min={0}
              max={channel === 'l' ? MAX_L : channel === 'c' ? MAX_C : MAX_H}
              value={
                channel === 'l' ? lch[0] : channel === 'c' ? lch[1] : lch[2]
              }
              onChange={e => {
                const [l, c, h] = lch
                const value = +e.target.value
                if (channel === 'l') onColorChange(i, [value, c, h])
                if (channel === 'c') onColorChange(i, [l, value, h])
                if (channel === 'h') onColorChange(i, [l, c, value])
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

const Value = styled.div<{ color: string }>`
  background-color: ${p => p.color};
  color: ${p => getMostContrast(p.color, ['black', 'white'])};
  text-align: center;
  font-size: 12px;
  padding: 4px 0;
  min-width: 0;
  flex: 1 0;
`

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
  channel: Channel
  colors: LCH[]
}) {
  const { width, height, channel, colors } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const debouncedRepaint = useMemo(
    () =>
      debounce(() => {
        console.log('render canvas')
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const intWidth = Math.ceil(width)
        const intHeight = Math.ceil(height)
        const pixels = drawChart({
          width: intWidth,
          height: intHeight,
          colors: colors,
          channel: channel,
        })
        const imageData = new ImageData(pixels, intWidth, intHeight)
        ctx?.putImageData(imageData, 0, 0)
      }, 300),
    [channel, colors, height, width]
  )

  useEffect(() => {
    debouncedRepaint()
    return () => {
      debouncedRepaint.cancel()
    }
  }, [channel, colors, height, width, debouncedRepaint])
  return <canvas ref={canvasRef} width={width} height={height} />
}
