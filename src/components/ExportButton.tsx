import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { paletteToHex, parsePalette } from '../palette'
import { Palette } from '../types'

export const ExportButton: FC<{
  palette: Palette
  onChange: (palette: Palette) => void
}> = ({ palette, onChange }) => {
  const [areaValue, setAreaValue] = useState('')

  useEffect(() => {
    setAreaValue(JSON.stringify(paletteToHex(palette), null, 2))
  }, [palette])

  return (
    <TextArea
      onKeyDown={e => e.stopPropagation()}
      value={areaValue}
      onFocus={e => e.target.select()}
      onChange={e => {
        const value = e.target.value
        setAreaValue(areaValue)
        if (value) {
          try {
            const json = JSON.parse(value)
            const palette = parsePalette(json)
            onChange(palette)
          } catch (error) {
            console.warn(error)
          }
        }
      }}
    />
  )
}

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 8px;
  background: var(--c-input-bg);
  border: 1px solid var(--c-input-bg-hover);
  border-radius: var(--radius-m);
`
