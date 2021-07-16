import React, { useState } from 'react'
import styled from 'styled-components'
import { ColorEditor } from './components/ColorEditor'
import { PaletteSwatches } from './components/PaletteSwatches'
import { parsePalette, setColor } from './palette'
import { PRESETS } from './presets'
import { Palette } from './types'

const defaultPalette = parsePalette(PRESETS[0])

export default function App() {
  const [palette, setPalette] = useState<Palette>(defaultPalette)
  const [selected, setSelected] = useState<[number, number]>([0, 0])
  const selectedColor = palette.colors[selected[0]][selected[1]]

  return (
    <Wrapper>
      <PaletteSection>
        {palette.name}
        <PaletteSwatches
          palette={palette}
          selected={selected}
          onSelect={setSelected}
          onPaletteChange={setPalette}
        />
        <ColorEditor
          color={selectedColor}
          onChange={color =>
            setPalette(setColor(palette, color, selected[0], selected[1]))
          }
        />
      </PaletteSection>
      <ChartsSection>456</ChartsSection>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  height: 100%;
  display: flex;
`
const PaletteSection = styled.section`
  min-width: 400px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #eee;
`
const ChartsSection = styled.section`
  flex-grow: 1;
  background: #333;
`
