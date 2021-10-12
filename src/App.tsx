import React, { useEffect, useState, useCallback, FC } from 'react'
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
import { ExportField } from './components/Export'
import { ColorInfo } from './components/ColorInfo'
// import { ExampleUI } from './components/ExampleUI'
import { Help } from './components/Help'
import { Button, ControlGroup, Select } from './components/inputs'
import { ThemeButton } from './components/ThemeButton'
import LZString from 'lz-string'
import { useKeyPress } from './useKeyPress'

const chartWidth = 400
const paletteList = PRESETS.map(parsePalette)

const useLocalPalette = createLocalStorageStateHook<Palette>(
  'palette',
  paletteList[0]
)

export default function App() {
  const [localPalette, setLocalPatette] = useLocalPalette()
  const [paletteIdx, setPaletteIdx] = useState<number>(localPalette ? 0 : 1)
  const [selected, setSelected] = useState<[number, number]>([0, 0])
  const [contrastMode, setContrastMode] = useState<'selected' | string>('white')
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('APCA')
  const palette = paletteIdx === 0 ? localPalette : paletteList[paletteIdx - 1]
  const selectedColor = palette.colors[selected[0]][selected[1]]
  const contrastTo =
    contrastMode === 'selected' ? toHex(selectedColor) : contrastMode

  const editPalette = useCallback(
    (palette: Palette | ((p: Palette) => Palette)) => {
      if (paletteIdx !== 0 && typeof palette === 'function') {
        setLocalPatette(palette(paletteList[paletteIdx - 1]))
      } else {
        setLocalPatette(palette)
      }
      setPaletteIdx(0)
    },
    [paletteIdx, setLocalPatette]
  )

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
          <ThemeButton />
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

        <ColorInfo palette={palette} selected={selected} />

        <ControlRow>
          <ExportField palette={palette} onChange={editPalette} />
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
          <Button
            title="Not all LCH colors are displayable in RGB color space. This button will tweak all LCH values to be displayable."
            onClick={() => editPalette(clampColorsToRgb)}
          >
            Make colors displayable
          </Button>
        </ControlRow>

        <Charts>
          <Scale
            width={chartWidth}
            selected={selected[1]}
            channel="l"
            colors={palette.colors[selected[0]]}
            onSelect={i => setSelected([selected[0], i])}
            onColorChange={(i, lch) => {
              setSelected([selected[0], i])
              editPalette(setColor(palette, lch, selected[0], i))
            }}
          />
          <ScaleIndicator axis="l" />
          <Scale
            width={chartWidth}
            selected={selected[0]}
            channel="l"
            colors={palette.colors.map(hue => hue[selected[1]])}
            onSelect={i => setSelected([i, selected[1]])}
            onColorChange={(i, lch) => {
              setSelected([i, selected[1]])
              editPalette(setColor(palette, lch, i, selected[1]))
            }}
          />

          <Scale
            width={chartWidth}
            selected={selected[1]}
            channel="c"
            colors={palette.colors[selected[0]]}
            onSelect={i => setSelected([selected[0], i])}
            onColorChange={(i, lch) => {
              setSelected([selected[0], i])
              editPalette(setColor(palette, lch, selected[0], i))
            }}
          />
          <ScaleIndicator axis="c" />
          <Scale
            width={chartWidth}
            selected={selected[0]}
            channel="c"
            colors={palette.colors.map(hue => hue[selected[1]])}
            onSelect={i => setSelected([i, selected[1]])}
            onColorChange={(i, lch) => {
              setSelected([i, selected[1]])
              editPalette(setColor(palette, lch, i, selected[1]))
            }}
          />

          <Scale
            width={chartWidth}
            selected={selected[1]}
            channel="h"
            colors={palette.colors[selected[0]]}
            onSelect={i => setSelected([selected[0], i])}
            onColorChange={(i, lch) => {
              setSelected([selected[0], i])
              editPalette(setColor(palette, lch, selected[0], i))
            }}
          />
          <ScaleIndicator axis="h" />
          <Scale
            width={chartWidth}
            selected={selected[0]}
            channel="h"
            colors={palette.colors.map(hue => hue[selected[1]])}
            onSelect={i => setSelected([i, selected[1]])}
            onColorChange={(i, lch) => {
              setSelected([i, selected[1]])
              editPalette(setColor(palette, lch, i, selected[1]))
            }}
          />
        </Charts>
        <Help palette={palette} />

        {/* <ExampleUI palette={palette} /> */}
      </ChartsSection>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  height: 100%;
  display: flex;
  @media (max-width: 860px) {
    flex-direction: column;
  }
`
const ControlRow = styled.main`
  display: flex;
  flex-wrap: wrap;
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
  gap: 16px;
  grid-template-columns: ${chartWidth}px 8px ${chartWidth}px;
`
const ChartsSection = styled.section`
  --c-bg: var(--c-bg-card);
  overflow: auto;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding: 16px 24px;
  flex-grow: 1;
  background: var(--c-bg);
  overflow: auto;
`

const Axis = styled.div`
  border-radius: 8px;
  width: 8px;
`
const AxisL = styled(Axis)`
  background: linear-gradient(#fff, #000);
`
const AxisC = styled(Axis)`
  background: linear-gradient(#0000ff, #4626d0, #5437a3, #554377, #4c4c4c);
`
const AxisH = styled(Axis)`
  background: linear-gradient(
    #fe97b7,
    #baacfa,
    #23c4f9,
    #3bcab5,
    #a7bf71,
    #eea674,
    #fe97b7
  );
`

const axises = {
  l: <AxisL />,
  c: <AxisC />,
  h: <AxisH />,
}

const ScaleIndicator: FC<{ axis: 'l' | 'c' | 'h' }> = ({ axis }) => {
  const pressed = useKeyPress('Key' + axis.toUpperCase())
  const style = pressed
    ? { fontWeight: 900, '--bg': 'var(--c-btn-bg-active)' }
    : { '--bg': 'var(--c-btn-bg)' }
  return (
    <ScaleIndicatorWrapper>
      <LetterContainer>
        <Letter style={style}>{axis.toUpperCase()}</Letter>
      </LetterContainer>
      {axises[axis]}
    </ScaleIndicatorWrapper>
  )
}

const LetterContainer = styled.span`
  position: relative;
`

const Letter = styled.span`
  width: 24px;
  text-align: center;
  line-height: 24px;
  color: var(--c-text-primary);
  background: var(--bg);
  border-radius: var(--radius-m);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const ScaleIndicatorWrapper = styled.div`
  display: grid;
  grid-template-rows: 26px auto;
`
