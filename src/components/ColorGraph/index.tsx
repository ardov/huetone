import styled from 'styled-components'
import { useStore } from '@nanostores/react'
import { getMostContrast } from 'shared/color'
import { Channel, LCH, TColor } from 'shared/types'
import { colorSpaceStore } from 'store/palette'
import { chartSettingsStore } from 'store/chartSettings'
import type { ChangeEvent } from 'react'
import { Canvas } from './Chart/Canvas'
import { clamp } from 'shared/utils'

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

  const setColor = (color: TColor, idx: number, value: number) => {
    const { l, c, h } = color
    value = clamp(value, ranges[channel].min, ranges[channel].max)
    if (channel === 'l') onColorChange(idx, [value, c, h])
    if (channel === 'c') onColorChange(idx, [l, value, h])
    if (channel === 'h') onColorChange(idx, [l, c, value])
  }

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
          <ValueInput
            key={i}
            type="number"
            color={color.hex}
            title={color[channel].toFixed(ranges[channel].precision)}
            min={ranges[channel].min}
            max={ranges[channel].max}
            step={ranges[channel].step}
            value={
              +color[channel].toFixed(
                i === selected ? ranges[channel].precision : 1
              )
            }
            onMouseDown={e => {
              if (i === selected || e.ctrlKey) return
              e.preventDefault()
              onSelect(i)
              const active = document.activeElement
              if (active instanceof HTMLInputElement) active.blur()
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                e.currentTarget.blur()
              }
            }}
            onFocus={e => {
              onSelect(i)
              setTimeout(() => e.target.select(), 0)
            }}
            onChange={e => setColor(color, i, +e.target.value)}
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
              onChange={e => setColor(color, i, +e.target.value)}
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

const ValueInput = styled.input<{
  color: string
}>`
  --c-contrasting: ${p => getMostContrast(p.color, ['black', 'white'])};
  background-color: ${p => p.color};
  color: var(--c-contrasting);
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  padding: 0;
  min-width: 0;
  flex: 1 0;
  border: 2px solid transparent;

  :first-child {
    border-radius: 8px 0 0 0;
  }
  :last-child {
    border-radius: 0 8px 0 0;
  }

  :focus {
    outline: none;
    border-color: var(--c-contrasting);
  }

  -moz-appearance: textfield;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
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
