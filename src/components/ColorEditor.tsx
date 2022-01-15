import { cielch as lch } from '../color2'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { valid } from '../color'
import { LCH } from '../types'
import { ControlGroup, Input } from './inputs'

const { ranges, toClampedRgb, fromHex, toHex } = lch

type ColorEditorProps = {
  color: LCH
  onChange: (color: LCH) => void
}

export const ColorEditor: FC<ColorEditorProps> = ({ color, onChange }) => {
  const [l, c, h] = color
  const [isFocused, setIsFocused] = useState(false)
  const [colorInput, setColorInput] = useState(toHex(color))
  const isDisplayable = !toClampedRgb(color).undisplayable

  useEffect(() => {
    if (!isFocused) {
      setColorInput(toHex(color))
    }
  }, [color, isFocused])

  return (
    <ControlGroup>
      <ChannelInputWrapper>
        <ChannelLabel>L</ChannelLabel>
        <ChannelInput
          type="number"
          min={0}
          max={ranges.l.max}
          step={0.5}
          value={+l.toFixed(2)}
          onChange={e => onChange([+e.target.value, c, h])}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>C</ChannelLabel>
        <ChannelInput
          type="number"
          min={0}
          max={ranges.c.max}
          step={0.5}
          value={+c.toFixed(2)}
          onChange={e => onChange([l, +e.target.value, h])}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>H</ChannelLabel>
        <ChannelInput
          type="number"
          min={0}
          max={ranges.h.max}
          step={0.5}
          value={+h.toFixed(2)}
          onChange={e => onChange([l, c, +e.target.value])}
        />
      </ChannelInputWrapper>
      <HexInput
        value={colorInput}
        style={{ color: isDisplayable ? 'inherit' : 'red' }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          setColorInput(toHex(color))
        }}
        onChange={e => {
          const value = e.target.value
          setColorInput(value)
          if (valid(value)) {
            onChange(fromHex(value))
          }
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
