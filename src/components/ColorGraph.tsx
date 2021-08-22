// import './styles.css'
import { getMostContrast, MAX_C, MAX_H, MAX_L, toHex } from '../color'
import { Channel, LCH } from '../types'
import styled from 'styled-components'
import { Canvas } from './Chart/Canvas'

const channelIndexes = { l: 0, c: 1, h: 2 }
const channelNames = {
  l: 'Lightness',
  c: 'Chroma a.k.a. saturation',
  h: 'Hue',
}

type ScaleProps = {
  colors: LCH[]
  selected: number
  channel: Channel
  height?: number
  width?: number
  onColorChange: (idx: number, value: LCH) => void
}

export function Scale({
  colors,
  selected,
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
      <div
        style={{
          display: 'flex',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
        }}
      >
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
              isSelected={i === selected}
              style={{
                // @ts-ignore
                '--bg': toHex(lch),
              }}
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

const Knob = styled.input.attrs({ type: 'range' })<{
  canvasHeight: number
  left: number
  isSelected: boolean
}>`
  --track: ${p => (p.isSelected ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
  position: absolute;
  width: ${p => p.canvasHeight + 16}px;
  height: 1px;
  left: ${p => p.left}px;
  bottom: -8px;
  transform: translateX(0.5px) rotate(-90deg);
  transform-origin: bottom left;
  margin: 0;
  background-color: transparent;
  -webkit-appearance: none;

  ::-webkit-slider-runnable-track {
    border: 0;
    height: 1px;
    background: linear-gradient(var(--track), var(--track));
    background-size: ${p => p.canvasHeight}px;
    background-repeat: no-repeat;
    background-position: center;
  }
  ::-moz-range-track {
    border: 0;
    height: 1px;
    background: linear-gradient(var(--track), var(--track));
    background-size: ${p => p.canvasHeight}px;
    background-repeat: no-repeat;
    background-position: center;
  }
  ::-webkit-slider-thumb {
    box-sizing: border-box;
    margin-top: -7px;
    width: 15px;
    height: 15px;
    background: transparent;
    transform: ${p => (p.isSelected ? 'scale(1)' : 'scale(0.75)')};
    border: ${p => (p.isSelected ? '5px' : '8px')} solid var(--bg, gray);
    border-radius: 13px;
    box-shadow: -3px 0 4px 0 rgba(0, 0, 0, 0.2);
    cursor: grab;
    transition: 100ms ease-in-out;
    -webkit-appearance: none;
  }

  ::-moz-range-thumb {
    box-sizing: border-box;
    margin-top: -7px;
    width: 15px;
    height: 15px;
    background: transparent;
    transform: ${p => (p.isSelected ? 'scale(1)' : 'scale(0.75)')};
    border: ${p => (p.isSelected ? '5px' : '8px')} solid var(--bg, gray);
    border-radius: 13px;
    box-shadow: -3px 0 4px 0 rgba(0, 0, 0, 0.2);
    cursor: grab;
    transition: 100ms ease-in-out;
  }

  ::-webkit-slider-thumb:active {
    cursor: grabbing;
  }
  ::-moz-range-thumb:active {
    cursor: grabbing;
  }
`
