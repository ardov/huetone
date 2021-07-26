import React, { useState } from 'react'
import styled from 'styled-components'
import { toHex } from './color'
import { ColorEditor } from './components/ColorEditor'
import { Scale } from './components/ColorGraph'
import { PaletteSwatches } from './components/PaletteSwatches'
import {
  clampColorsToRgb,
  parsePalette,
  setColor,
  setHueHue,
  setToneLuminance,
} from './palette'
import { PRESETS } from './presets'
import { OverlayMode, Palette } from './types'
import { createLocalStorageStateHook } from 'use-local-storage-state'
import { ExportButton } from './components/ExportButton'
import { ColorInfo } from './components/ColorInfo'

const paletteList = PRESETS.map(parsePalette)

const useLocalPalette = createLocalStorageStateHook<Palette>(
  'palette',
  paletteList[0]
)

export default function App() {
  const [localPalette, setLocalPatette] = useLocalPalette()
  const [paletteIdx, setPaletteIdx] = useState<number>(localPalette ? 0 : 1)
  const [selected, setSelected] = useState<[number, number]>([0, 0])
  const [contrastMode, setContrastMode] = useState<'selected' | string>(
    'selected'
  )
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('APCA')
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
        <ControlRow>
          <Select
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
          </Select>
          <Select
            name="overlay"
            value={overlayMode}
            onChange={e => setOverlayMode(e.target.value as OverlayMode)}
          >
            <option value={'WCAG'}>WCAG contrast</option>
            <option value={'APCA'}>APCA contrast</option>
          </Select>
          <Select
            name="color"
            value={contrastMode}
            onChange={e => setContrastMode(e.target.value)}
          >
            <option value={'selected'}>to selected</option>
            <option value={'white'}>to white</option>
          </Select>
        </ControlRow>
        <PaletteSwatches
          palette={palette}
          selected={selected}
          overlayMode={overlayMode}
          contrastTo={contrastTo}
          onSelect={setSelected}
          onPaletteChange={editPalette}
        />

        <ControlRow>
          <Button
            onClick={() =>
              editPalette(p =>
                setToneLuminance(p, selectedColor[0], selected[1])
              )
            }
          >
            Apply current luminance to column
          </Button>
          <Button
            onClick={() =>
              editPalette(p => setHueHue(p, selectedColor[2], selected[0]))
            }
          >
            Apply current hue to row
          </Button>
        </ControlRow>
        <ControlRow></ControlRow>

        <ColorInfo palette={palette} selected={selected} />

        <ControlRow>
          <ExportButton palette={palette} onChange={editPalette} />
        </ControlRow>
      </PaletteSection>

      <ChartsSection>
        <ControlRow>
          <ColorEditor
            color={selectedColor}
            onChange={color =>
              editPalette(setColor(palette, color, selected[0], selected[1]))
            }
          />
          <Button onClick={() => editPalette(clampColorsToRgb)}>
            Make colors displayable
          </Button>
        </ControlRow>
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
  overflow: auto;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const Select = styled.select`
  color: #727272;
  border: 1px solid #c6c6c6;
  border-radius: var(--radius-m);
  background-color: #f8f8f8;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 8px;

  :hover {
    color: black;
  }
`
const Button = styled.button`
  color: #727272;
  border: 1px solid #c6c6c6;
  border-radius: var(--radius-m);
  background-color: #f8f8f8;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 8px;

  :hover {
    color: black;
  }
`
