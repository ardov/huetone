import React, { useState } from 'react'
import styled from 'styled-components'
import { toHex } from './color'
import { ColorEditor } from './components/ColorEditor'
import { Scale } from './components/ColorGraph'
import { PaletteSwatches } from './components/PaletteSwatches'
import {
  addHue,
  addTone,
  clampColorsToRgb,
  parsePalette,
  removeHue,
  removeTone,
  setColor,
  setHueHue,
  setToneLuminance,
} from './palette'
import { PRESETS } from './presets'
import { Palette } from './types'
import { createLocalStorageStateHook } from 'use-local-storage-state'
import { ExportButton } from './components/ExportButton'

const paletteList = PRESETS.map(parsePalette)

const useLocalPalette = createLocalStorageStateHook<Palette>(
  'palette',
  paletteList[0]
)

export default function App() {
  const [localPalette, setLocalPatette] = useLocalPalette()
  // const [currentPalette, setCurrentPalette] = useLocalPalette()
  const [paletteIdx, setPaletteIdx] = useState<number>(localPalette ? 0 : 1)
  const [selected, setSelected] = useState<[number, number]>([0, 0])
  const [contrastMode, setContrastMode] = useState<'selected' | string>(
    'selected'
  )
  const palette = paletteIdx === 0 ? localPalette : paletteList[paletteIdx - 1]
  const selectedColor = palette.colors[selected[0]][selected[1]]
  const contrastTo =
    contrastMode === 'selected' ? toHex(selectedColor) : contrastMode

  const editPalette = (palette: Palette | ((p: Palette) => Palette)) => {
    if (paletteIdx !== 0 && typeof palette === 'function') {
      setLocalPatette(palette(paletteList[paletteIdx - 1]))
    } else {
      setLocalPatette(palette)
    }
    setPaletteIdx(0)
  }

  return (
    <Wrapper>
      <PaletteSection>
        <select
          name="palettes"
          value={paletteIdx}
          onChange={e => {
            const value = +e.target.value
            setSelected([0, 0])
            setPaletteIdx(value)
          }}
        >
          <option value={0}>Local palette</option>
          {paletteList.map((p, i) => (
            <option key={p.name} value={i + 1}>
              {p.name}
            </option>
          ))}
        </select>
        <PaletteSwatches
          palette={palette}
          selected={selected}
          contrastTo={contrastTo}
          onSelect={setSelected}
          onPaletteChange={editPalette}
        />
        <ControlRow>
          <button
            onClick={() =>
              setContrastMode(
                contrastMode === 'selected' ? 'white' : 'selected'
              )
            }
          >
            {contrastMode === 'selected'
              ? 'Show contrast to white [w]'
              : 'Show contrast to selected'}
          </button>
          <button onClick={() => editPalette(clampColorsToRgb)}>
            Make colors displayable
          </button>
        </ControlRow>
        <ControlRow>
          <button
            onClick={() =>
              editPalette(p =>
                setToneLuminance(p, selectedColor[0], selected[1])
              )
            }
          >
            Apply current luminance to column
          </button>
        </ControlRow>
        <ControlRow>
          <button
            onClick={() =>
              editPalette(p => setHueHue(p, selectedColor[2], selected[0]))
            }
          >
            Apply current hue to row
          </button>
        </ControlRow>
        <ControlRow>
          <button
            onClick={() => {
              editPalette(p => removeTone(p, selected[1]))
              if (selected[1] === palette.tones.length - 1)
                setSelected(s => [s[0], s[1] - 1])
            }}
          >
            ❌ Delete {palette.tones[selected[1]]}
          </button>
          <button onClick={() => editPalette(p => addTone(p))}>
            ➕ Add tone column
          </button>
        </ControlRow>
        <ControlRow>
          <button
            onClick={() => {
              editPalette(p => removeHue(p, selected[0]))
              if (selected[0] === palette.hues.length - 1)
                setSelected(s => [s[0] - 1, s[1]])
            }}
          >
            ❌ Delete {palette.hues[selected[0]]}
          </button>
          <button onClick={() => editPalette(p => addHue(p))}>
            ➕ Add hue row
          </button>
        </ControlRow>
        <ControlRow>
          <ExportButton palette={palette} />
        </ControlRow>
      </PaletteSection>
      <ChartsSection>
        <ColorEditor
          color={selectedColor}
          onChange={color =>
            editPalette(setColor(palette, color, selected[0], selected[1]))
          }
        />
        <Charts>
          <Column>
            <Scale
              channel="l"
              colors={palette.colors[selected[0]]}
              onColorChange={(i, lch) => {
                setSelected([selected[0], i])
                editPalette(setColor(palette, lch, selected[0], i))
              }}
            />
            <Scale
              channel="c"
              colors={palette.colors[selected[0]]}
              onColorChange={(i, lch) => {
                setSelected([selected[0], i])
                editPalette(setColor(palette, lch, selected[0], i))
              }}
            />
            <Scale
              channel="h"
              colors={palette.colors[selected[0]]}
              onColorChange={(i, lch) => {
                setSelected([selected[0], i])
                editPalette(setColor(palette, lch, selected[0], i))
              }}
            />
          </Column>
          <Column>
            <Scale
              channel="l"
              colors={palette.colors.map(hue => hue[selected[1]])}
              onColorChange={(i, lch) => {
                setSelected([i, selected[1]])
                editPalette(setColor(palette, lch, i, selected[1]))
              }}
            />
            <Scale
              channel="c"
              colors={palette.colors.map(hue => hue[selected[1]])}
              onColorChange={(i, lch) => {
                setSelected([i, selected[1]])
                editPalette(setColor(palette, lch, i, selected[1]))
              }}
            />
            <Scale
              channel="h"
              colors={palette.colors.map(hue => hue[selected[1]])}
              onColorChange={(i, lch) => {
                setSelected([i, selected[1]])
                editPalette(setColor(palette, lch, i, selected[1]))
              }}
            />
          </Column>
        </Charts>
      </ChartsSection>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  height: 100%;
  display: flex;
`
const ControlRow = styled.main`
  display: flex;
  gap: 8px;
`
const PaletteSection = styled.section`
  overflow: auto;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fff;
`
const Charts = styled.section`
  display: grid;
  grid-template-columns: repeat(2, auto);
`
const ChartsSection = styled.section`
  overflow: auto;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding: 16px 24px;
  flex-grow: 1;
  background: #aaa;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
