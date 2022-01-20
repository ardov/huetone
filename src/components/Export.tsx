import React, { FC, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { exportToHexPalette, exportToTokens, parseHexPalette } from '../palette'
import { Button, TextArea } from './inputs'
import { useStore } from '@nanostores/react'
import { paletteStore, setPalette } from '../store/palette'

export const TokenExportButton: FC = () => {
  const palette = useStore(paletteStore)
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    const tokens = exportToTokens(palette)
    const json = JSON.stringify(tokens, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
  }
  useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])
  return <Button onClick={onCopy}>{copied ? 'Copied!' : 'Copy tokens'}</Button>
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
