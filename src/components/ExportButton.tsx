import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { paletteToHex, parsePalette } from '../palette'
import { Palette } from '../types'
import { TextArea } from './inputs'

export const ExportButton: FC<{
  palette: Palette
  onChange: (palette: Palette) => void
}> = ({ palette, onChange }) => {
  const [areaValue, setAreaValue] = useState('')

  useEffect(() => {
    setAreaValue(JSON.stringify(paletteToHex(palette), null, 2))
  }, [palette])

  return (
    <JSONArea
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

const JSONArea = styled(TextArea)`
  width: 100%;
  min-height: 120px;
  resize: none;
`
