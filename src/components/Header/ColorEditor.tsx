import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Channel, TColor } from 'shared/types'
import { ControlGroup, Input } from '../inputs'
import { useStore } from '@nanostores/react'
import { colorSpaceStore } from 'store/palette'
import { clamp } from 'shared/utils'

type ColorEditorProps = {
  color: TColor
  onChange: (color: TColor) => void
}

export const ColorEditor: FC<ColorEditorProps> = ({ color, onChange }) => {
  const { lch2color, hex2color, ranges } = useStore(colorSpaceStore)
  const { l, c, h, hex, within_sRGB } = color
  const [isFocused, setIsFocused] = useState(false)
  const [colorInput, setColorInput] = useState(hex)

  useEffect(() => {
    if (!isFocused) setColorInput(hex)
  }, [hex, isFocused])

  const setColor = (channel: Channel, value: number) => {
    value = clamp(value, ranges[channel].min, ranges[channel].max)
    if (channel === 'l') onChange(lch2color([value, c, h]))
    if (channel === 'c') onChange(lch2color([l, value, h]))
    if (channel === 'h') onChange(lch2color([l, c, value]))
  }

  return (
    <ControlGroup>
      <ChannelInputWrapper>
        <ChannelLabel>L</ChannelLabel>
        <ChannelInput
          type="number"
          min={ranges.l.min}
          max={ranges.l.max}
          step={ranges.l.step}
          value={+l.toFixed(ranges.l.precision)}
          onChange={e => setColor('l', +e.target.value)}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>C</ChannelLabel>
        <ChannelInput
          type="number"
          min={ranges.c.min}
          max={ranges.c.max}
          step={ranges.c.step}
          value={+c.toFixed(ranges.c.precision)}
          onChange={e => setColor('c', +e.target.value)}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>H</ChannelLabel>
        <ChannelInput
          type="number"
          min={ranges.h.min}
          max={ranges.h.max}
          step={ranges.h.step}
          value={+h.toFixed(ranges.h.precision)}
          onChange={e => setColor('h', +e.target.value)}
        />
      </ChannelInputWrapper>
      <HexInput
        value={colorInput}
        style={{ color: within_sRGB ? 'inherit' : 'red' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          setColorInput(hex)
        }}
        onChange={e => {
          const value = e.target.value
          setColorInput(value)
          let color = hex2color(value)
          if (color) onChange(color)
        }}
      />
    </ControlGroup>
  )
}

const ChannelInputWrapper = styled.label`
  position: relative;
  isolation: isolate;
`
const ChannelLabel = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  padding: 4px 0 4px 8px;
  color: var(--c-text-hint);
`
const ChannelInput = styled(Input)`
  width: 80px;
  padding-left: 24px;
  border-radius: inherit;
  height: 100%;
  -moz-appearance: textfield;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const HexInput = styled(Input)`
  width: 80px;
`
