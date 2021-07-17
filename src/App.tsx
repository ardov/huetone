import React, { useState } from 'react'
import styled from 'styled-components'
import { ColorEditor } from './components/ColorEditor'
import { Scale } from './components/ColorGraph'
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
      <ChartsSection>
        <Column>
          <Scale
            axis="l"
            colors={palette.colors[selected[0]]}
            onColorChange={(i, lch) => {
              setSelected([selected[0], i])
              setPalette(setColor(palette, lch, selected[0], i))
            }}
          />
          <Scale
            axis="c"
            colors={palette.colors[selected[0]]}
            onColorChange={(i, lch) => {
              setSelected([selected[0], i])
              setPalette(setColor(palette, lch, selected[0], i))
            }}
          />
          <Scale
            axis="h"
            colors={palette.colors[selected[0]]}
            onColorChange={(i, lch) => {
              setSelected([selected[0], i])
              setPalette(setColor(palette, lch, selected[0], i))
            }}
          />
        </Column>
        <Column>
          <Scale
            axis="l"
            colors={palette.colors.map(hue => hue[selected[1]])}
            onColorChange={(i, lch) => {
              setSelected([i, selected[1]])
              setPalette(setColor(palette, lch, i, selected[1]))
            }}
          />
          <Scale
            axis="c"
            colors={palette.colors.map(hue => hue[selected[1]])}
            onColorChange={(i, lch) => {
              setSelected([i, selected[1]])
              setPalette(setColor(palette, lch, i, selected[1]))
            }}
          />
          <Scale
            axis="h"
            colors={palette.colors.map(hue => hue[selected[1]])}
            onColorChange={(i, lch) => {
              setSelected([i, selected[1]])
              setPalette(setColor(palette, lch, i, selected[1]))
            }}
          />
        </Column>
      </ChartsSection>
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
  display: grid;
  padding: 16px;
  grid-template-columns: repeat(2, auto);
  flex-grow: 1;
  background: #333;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
