import styled from 'styled-components'
import { useStore } from '@nanostores/react'
import { getMostContrast } from 'shared/color'
import { Channel, LCH, TColor } from 'shared/types'
import { colorSpaceStore } from 'store/palette'
import { chartSettingsStore } from 'store/chartSettings'
import { Canvas } from './Chart/Canvas'

type ScaleProps = {
  colors: TColor[]
  selected: number
  channel: Channel
  height?: number
  width?: number
  onSelect: (idx: number) => void
  onColorChange: (idx: number, lch: LCH) => void
}

export function Scale({
  colors,
  selected,
  channel = 'l',
  height = 150,
  width = 400,
  onSelect,
  onColorChange,
}: ScaleProps) {
  const { showColors } = useStore(chartSettingsStore)
  const { ranges } = useStore(colorSpaceStore)
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
      <div
        style={{
          display: 'flex',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
        }}
      >
        {colors.map((color, i) => (
          <Value key={i} color={color.hex} onClick={() => onSelect(i)}>
            {+color[channel].toFixed(1)}
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

        {colors.map((color, i) => {
          const contrast = getMostContrast(color.hex, ['#fff', '#000'])
          return (
            <Knob
              key={i}
              min={ranges[channel].min}
              max={ranges[channel].max}
              step={ranges[channel].step}
              value={color[channel]}
              onChange={e => {
                const { l, c, h } = color
                const value = +e.target.value
                if (channel === 'l') onColorChange(i, [value, c, h])
                if (channel === 'c') onColorChange(i, [l, value, h])
                if (channel === 'h') onColorChange(i, [l, c, value])
              }}
              onClick={() => onSelect(i)}
              isSelected={i === selected}
              style={{
                // @ts-ignore
                '--contrast': contrast,
                '--bg': showColors ? contrast : color.hex,
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
  line-height: 24px;
  padding: 0;
  min-width: 0;
  flex: 1 0;
`

const Knob = styled.input.attrs({ type: 'range' })<{
  canvasHeight: number
  left: number
  isSelected: boolean
}>`
  --track: ${p => (p.isSelected ? 'var(--c-divider)' : 'transparent')};
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

  :focus {
    outline: none;
  }

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
    box-shadow: 0 0 2px 0px var(--contrast);
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
