import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { toHex } from './color'
import { ColorEditor } from './components/ColorEditor'
import { Scale } from './components/ColorGraph'
import { PaletteSwatches } from './components/PaletteSwatches'
import {
  clampColorsToRgb,
  paletteToHex,
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
import { ExampleUI } from './components/ExampleUI'
import { Button, ControlGroup, Select } from './components/inputs'
import LZString from 'lz-string'

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const compressed = params.get('palette')
    if (!compressed) return
    const json = LZString.decompressFromEncodedURIComponent(compressed)
    if (!json) return
    try {
      const hexPalette = JSON.parse(json)
      setLocalPatette(parsePalette(hexPalette))
    } catch (e) {}
  }, [setLocalPatette])

  useEffect(() => {
    const href = window.location.href
    const [base, search] = href.split('?')
    const params = new URLSearchParams(search)
    const hexPalette = paletteToHex(palette)
    const compressed = LZString.compressToEncodedURIComponent(
      JSON.stringify(hexPalette)
    )
    params.set('palette', compressed)
    let location = [base, params.toString()].join('?')
    window.history.pushState('page2', 'Title', location)
  }, [palette])

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
          <ControlGroup>
            <Button
              onClick={() =>
                setOverlayMode(m => (m === 'APCA' ? 'WCAG' : 'APCA'))
              }
            >
              {overlayMode} contrast
            </Button>
            <Button
              onClick={() =>
                setContrastMode(m => (m === 'selected' ? 'white' : 'selected'))
              }
            >
              vs. {contrastMode}
            </Button>
          </ControlGroup>
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
              selected={selected[1]}
              channel="l"
              colors={palette.colors[selected[0]]}
              onColorChange={(i, lch) => {
                setSelected([selected[0], i])
                editPalette(setColor(palette, lch, selected[0], i))
              }}
            />
            <Scale
              selected={selected[1]}
              channel="c"
              colors={palette.colors[selected[0]]}
              onColorChange={(i, lch) => {
                setSelected([selected[0], i])
                editPalette(setColor(palette, lch, selected[0], i))
              }}
            />
            <Scale
              selected={selected[1]}
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
              selected={selected[0]}
              channel="l"
              colors={palette.colors.map(hue => hue[selected[1]])}
              onColorChange={(i, lch) => {
                setSelected([i, selected[1]])
                editPalette(setColor(palette, lch, i, selected[1]))
              }}
            />
            <Scale
              selected={selected[0]}
              channel="c"
              colors={palette.colors.map(hue => hue[selected[1]])}
              onColorChange={(i, lch) => {
                setSelected([i, selected[1]])
                editPalette(setColor(palette, lch, i, selected[1]))
              }}
            />
            <Scale
              selected={selected[0]}
              channel="h"
              colors={palette.colors.map(hue => hue[selected[1]])}
              onColorChange={(i, lch) => {
                setSelected([i, selected[1]])
                editPalette(setColor(palette, lch, i, selected[1]))
              }}
            />
          </Column>
        </Charts>

        <ExampleUI palette={palette} />
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
  width: min-content;
  overflow: auto;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`
const Charts = styled.section`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, auto);
`
const ChartsSection = styled.section`
  overflow: auto;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding: 16px 24px;
  flex-grow: 1;
  background: var(--c-bg-card);
  overflow: auto;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
