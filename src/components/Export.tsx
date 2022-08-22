import React, { FC, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useStore } from '@nanostores/react'
import {
  exportToHexPalette,
  exportToTokens,
  parseHexPalette,
} from 'store/palette'
import { exportToCSS } from 'store/palette/converters'
import { paletteStore, setPalette } from 'store/palette'
import { TextArea } from './inputs'
import { CopyButton } from './CopyButton'

export const TokenExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton
      getContent={() => {
        const tokens = exportToTokens(palette)
        return JSON.stringify(tokens, null, 2)
      }}
    >
      Copy tokens
    </CopyButton>
  )
}

export const CSSExportButton: FC = () => {
  const palette = useStore(paletteStore)
  return (
    <CopyButton getContent={() => exportToCSS(palette)}>
      Copy CSS variables
    </CopyButton>
  )
}

export const ExportField: FC = () => {
  const palette = useStore(paletteStore)
  const ref = useRef<any>()
  const [areaValue, setAreaValue] = useState('')
  const currentJSON = JSON.stringify(exportToHexPalette(palette), null, 2)

  useEffect(() => {
    if (document.activeElement !== ref.current) {
      const newPaletteJson = currentJSON
      setAreaValue(newPaletteJson)
    }
  }, [currentJSON])

  return (
    <JSONArea
      ref={ref}
      onBlur={() => setAreaValue(currentJSON)}
      value={areaValue}
      onFocus={e => e.target.select()}
      onChange={e => {
        const value = e.target.value
        setAreaValue(value)
        if (value) {
          try {
            const json = JSON.parse(value)
            const newPalette = parseHexPalette(json, palette.mode)
            setPalette(newPalette)
          } catch (error) {
            console.warn('Parsing error', error)
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
