import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { displayable, MAX_C, MAX_H, MAX_L, toHex, toLch, valid } from '../color'
import { LCH } from '../types'
import { ControlGroup, Input } from './inputs'

type ColorEditorProps = {
  color: LCH
  onChange: (color: LCH) => void
}

export const ColorEditor: FC<ColorEditorProps> = ({ color, onChange }) => {
  const [l, c, h] = color
  const [isFocused, setIsFocused] = useState(false)
  const [colorInput, setColorInput] = useState(toHex(color))
  const isDisplayable = displayable(color)

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
          max={MAX_L}
          step={0.5}
          value={+l.toFixed(2)}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => onChange([+e.target.value, c, h])}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>C</ChannelLabel>
        <ChannelInput
          type="number"
          min={0}
          max={MAX_C}
          step={0.5}
          value={+c.toFixed(2)}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => onChange([l, +e.target.value, h])}
        />
      </ChannelInputWrapper>
      <ChannelInputWrapper>
        <ChannelLabel>H</ChannelLabel>
        <ChannelInput
          type="number"
          min={0}
          max={MAX_H}
          step={0.5}
          value={+h.toFixed(2)}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => onChange([l, c, +e.target.value])}
        />
      </ChannelInputWrapper>
      <HexInput
        value={colorInput}
        style={{ color: isDisplayable ? 'inherit' : 'red' }}
        onKeyDown={e => e.stopPropagation()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          setColorInput(toHex(color))
        }}
        onChange={e => {
          const value = e.target.value
          setColorInput(value)
          if (valid(value)) {
            onChange(toLch(value))
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
  top: 1px;
  left: 0;
  padding: 4px 0 4px 8px;
  color: var(--c-text-hint);
`
const ChannelInput = styled(Input)`
  width: 80px;
  padding-left: 24px;
  border-radius: inherit;
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
