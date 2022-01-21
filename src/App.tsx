import { useStore } from '@nanostores/react'
import React, { useState, FC } from 'react'
import styled from 'styled-components'
import { ColorEditor } from './components/ColorEditor'
import { Scale } from './components/ColorGraph'
import { PaletteSwatches } from './components/PaletteSwatches'
import {
  clampColorsToRgb,
  getPaletteLink,
  parseHexPalette,
  setColor,
  setHueHue,
  setToneLuminance,
} from './palette'
import { ExportField } from './components/Export'
import { ColorInfo } from './components/ColorInfo'
import { Help } from './components/Help'
import { Button, ControlGroup, Select } from './components/inputs'
import { ThemeButton } from './components/ThemeButton'
import { KeyPressHandler } from './components/KeyPressHandler'
import { useKeyPress } from './hooks/useKeyPress'
import { PaletteSelect } from './components/DropdownMenu'
import { CopyButton } from './components/CopyButton'
import { paletteListStore } from './store/paletteList'
import { paletteStore, setPalette, toggleColorSpace } from './store/palette'
import { selectedStore, setSelected } from './store/currentPosition'
import { overlayStore, setOverlayMode, setVersusColor } from './store/overlay'

const chartWidth = 400

export default function App() {
  const paletteList = useStore(paletteListStore)
  const palette = useStore(paletteStore)
  const selected = useStore(selectedStore)
  const overlay = useStore(overlayStore)

  const [paletteIdx, setPaletteIdx] = useState<number>(0)

  const switchPalette: React.ChangeEventHandler<HTMLSelectElement> = e => {
    const idx = +e.target.value
    const newPalette = parseHexPalette(paletteList[idx], palette.mode)
    setPaletteIdx(idx)
    setPalette(newPalette)
  }

  return (
    <Wrapper>
      <KeyPressHandler />
      <PaletteSection>
        <PaletteSelect currentIdx={paletteIdx} />
        <ControlRow>
          <Select name="palettes" value={paletteIdx} onChange={switchPalette}>
            {paletteList.map((p, i) => (
              <option key={p.name + i} value={i}>
                {p.name}
              </option>
            ))}
          </Select>
          <Button onClick={toggleColorSpace}>{palette.mode}</Button>
          <ControlGroup>
            <Button
              onClick={() =>
                setOverlayMode(overlay.mode === 'APCA' ? 'WCAG' : 'APCA')
              }
            >
              {overlay.mode} contrast
            </Button>
            <Button
              onClick={() =>
                setVersusColor(
                  overlay.versus === 'selected' ? 'white' : 'selected'
                )
              }
            >
              vs. {overlay.versus}
            </Button>
          </ControlGroup>
          <ThemeButton />
          <CopyButton getContent={() => getPaletteLink(palette)}>
            Copy link
          </CopyButton>
        </ControlRow>
        <PaletteSwatches />
        <ControlRow>
          <Button
            onClick={() =>
              setPalette(
                setToneLuminance(palette, selected.color.l, selected.toneId)
              )
            }
          >
            Apply current luminance to column
          </Button>
          <Button
            onClick={() =>
              setPalette(setHueHue(palette, selected.color.h, selected.hueId))
            }
          >
            Apply current hue to row
          </Button>
        </ControlRow>
        <ColorInfo />
        <ControlRow>
          <ExportField />
        </ControlRow>
      </PaletteSection>

      <ChartsSection>
        <ControlRow>
          <ColorEditor
            color={selected.color}
            onChange={color => {
              let { l, c, h } = color
              setPalette(
                setColor(palette, [l, c, h], selected.hueId, selected.toneId)
              )
            }}
          />
          <Button
            title="Not all LCH colors are displayable in RGB color space. This button will tweak all LCH values to be displayable."
            onClick={() => setPalette(clampColorsToRgb(palette))}
          >
            Make colors displayable
          </Button>
        </ControlRow>

        <Charts>
          <Scale
            width={chartWidth}
            selected={selected.toneId}
            channel="l"
            colors={palette.colors[selected.hueId]}
            onSelect={i => setSelected([selected.hueId, i])}
            onColorChange={(i, color) => {
              let { l, c, h } = color
              setSelected([selected.hueId, i])
              setPalette(setColor(palette, [l, c, h], selected.hueId, i))
            }}
          />
          <ScaleIndicator axis="l" />
          <Scale
            width={chartWidth}
            selected={selected.hueId}
            channel="l"
            colors={palette.colors.map(hue => hue[selected.toneId])}
            onSelect={i => setSelected([i, selected.toneId])}
            onColorChange={(i, color) => {
              let { l, c, h } = color
              setSelected([i, selected.toneId])
              setPalette(setColor(palette, [l, c, h], i, selected.toneId))
            }}
          />

          <Scale
            width={chartWidth}
            selected={selected.toneId}
            channel="c"
            colors={palette.colors[selected.hueId]}
            onSelect={i => setSelected([selected.hueId, i])}
            onColorChange={(i, color) => {
              let { l, c, h } = color
              setSelected([selected.hueId, i])
              setPalette(setColor(palette, [l, c, h], selected.hueId, i))
            }}
          />
          <ScaleIndicator axis="c" />
          <Scale
            width={chartWidth}
            selected={selected.hueId}
            channel="c"
            colors={palette.colors.map(hue => hue[selected.toneId])}
            onSelect={i => setSelected([i, selected.toneId])}
            onColorChange={(i, color) => {
              let { l, c, h } = color
              setSelected([i, selected.toneId])
              setPalette(setColor(palette, [l, c, h], i, selected.toneId))
            }}
          />

          <Scale
            width={chartWidth}
            selected={selected.toneId}
            channel="h"
            colors={palette.colors[selected.hueId]}
            onSelect={i => setSelected([selected.hueId, i])}
            onColorChange={(i, color) => {
              let { l, c, h } = color
              setSelected([selected.hueId, i])
              setPalette(setColor(palette, [l, c, h], selected.hueId, i))
            }}
          />
          <ScaleIndicator axis="h" />
          <Scale
            width={chartWidth}
            selected={selected.hueId}
            channel="h"
            colors={palette.colors.map(hue => hue[selected.toneId])}
            onSelect={i => setSelected([i, selected.toneId])}
            onColorChange={(i, color) => {
              let { l, c, h } = color
              setSelected([i, selected.toneId])
              setPalette(setColor(palette, [l, c, h], i, selected.toneId))
            }}
          />
        </Charts>
        <Help />
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
  background: linear-gradient(#ff00ff, #9f9f9f);
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
