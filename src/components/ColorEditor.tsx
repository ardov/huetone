import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MAX_C, MAX_H, MAX_L, toHex, toLch, valid } from '../color'
import { LCH } from '../types'

type ColorEditorProps = {
  color: LCH
  onChange: (color: LCH) => void
}

export const ColorEditor: FC<ColorEditorProps> = ({ color, onChange }) => {
  const [l, c, h] = color
  const [isFocused, setIsFocused] = useState(false)
  const [colorInput, setColorInput] = useState(toHex(color))

  useEffect(() => {
    if (!isFocused) {
      setColorInput(toHex(color))
    }
  }, [color, isFocused])

  return (
    <Wrapper>
      <label>
        <span>L</span>
        <ChanelInput
          type="number"
          min={0}
          max={MAX_L}
          step={0.5}
          value={+l.toFixed(2)}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => onChange([+e.target.value, c, h])}
        />
      </label>
      <label>
        <span>C</span>
        <ChanelInput
          type="number"
          min={0}
          max={MAX_C}
          step={0.5}
          value={+c.toFixed(2)}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => onChange([l, +e.target.value, h])}
        />
      </label>
      <label>
        <span>H</span>
        <ChanelInput
          type="number"
          min={0}
          max={MAX_H}
          step={0.5}
          value={+h.toFixed(2)}
          onKeyDown={e => e.stopPropagation()}
          onChange={e => onChange([l, c, +e.target.value])}
        />
      </label>
      <input
        value={colorInput}
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
`

const ChanelInput = styled.input`
  width: 64px;
  padding: 0;
  background: #eee;
  -moz-appearance: textfield;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
