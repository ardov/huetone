import React, { FC, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { paletteToHex, paletteToTokens, parsePalette } from '../palette'
import { Palette } from '../types'
import { Button, TextArea } from './inputs'

export const TokenExportButton: FC<{
  palette: Palette
}> = ({ palette }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    const tokens = paletteToTokens(palette)
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

export const ExportField: FC<{
  palette: Palette
  onChange: (palette: Palette) => void
}> = ({ palette, onChange }) => {
  const ref = useRef<any>()
  const [areaValue, setAreaValue] = useState('')
  const currentJSON = JSON.stringify(paletteToHex(palette), null, 2)

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
      onKeyDown={e => e.stopPropagation()}
      value={areaValue}
      onFocus={e => e.target.select()}
      onChange={e => {
        const value = e.target.value
        setAreaValue(value)
        if (value) {
          try {
            const json = JSON.parse(value)
            const palette = parsePalette(json)
            onChange(palette)
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
