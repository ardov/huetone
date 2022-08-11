import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { TColor } from 'shared/types'
import { ControlGroup, Input } from '../inputs'
import { useStore } from '@nanostores/react'
import { colorSpaceStore } from 'store/palette'

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

  return (
    <ControlGroup>
      <ChannelInputWrapper>
        <ChannelLabel>L</ChannelLabel>
        <ChannelInput
          type="number"
          min={ranges.l.min}
          max={ranges.l.max}
          step={0.5}
          value={+l.toFixed(2)}
          onChange={e => onChange(lch2color([+e.target.value, c, h]))}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>C</ChannelLabel>
        <ChannelInput
          type="number"
          min={ranges.c.min}
          max={ranges.c.max}
          step={0.5}
          value={+c.toFixed(2)}
          onChange={e => onChange(lch2color([l, +e.target.value, h]))}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>H</ChannelLabel>
        <ChannelInput
          type="number"
          min={ranges.c.min}
          max={ranges.h.max}
          step={0.5}
          value={+h.toFixed(2)}
          onChange={e => onChange(lch2color([l, c, +e.target.value]))}
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
