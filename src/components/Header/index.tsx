import { useStore } from '@nanostores/react'
import React from 'react'
import styled from 'styled-components'
import { getPaletteLink, setColor, setPalette } from '../../store/palette'
import { Button, ControlGroup } from '../inputs'
import { ThemeButton } from './ThemeButton'
import { PaletteSelect } from './PaletteSelect'
import { CopyButton } from '../CopyButton'
import { Link } from '../../icons/Link'
import { GitHub } from '../../icons/GitHub'
import { paletteStore } from '../../store/palette'
import {
  overlayStore,
  setOverlayMode,
  setVersusColor,
  TOverlayMode,
} from '../../store/overlay'
import { ColorEditor } from './ColorEditor'
import { ColorActions } from './ColorActions'
import { selectedStore } from '../../store/currentPosition'
import { ChartSettings } from './ChartSettings'

const modes: TOverlayMode[] = ['APCA', 'WCAG', 'NONE', 'DELTA_E']

const texts = {
  APCA: 'APCA contrast',
  WCAG: 'WCAG contrast',
  NONE: 'Without overlay',
  DELTA_E: 'Delta E distance',
}

export function Header() {
  const palette = useStore(paletteStore)
  const overlay = useStore(overlayStore)
  const selected = useStore(selectedStore)

  return (
    <Wrapper>
      <ControlRow>
        <PaletteSelect />
        <CopyButton getContent={() => getPaletteLink(palette)}>
          <Link />
          Copy link
        </CopyButton>
      </ControlRow>

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
        <ColorActions />
      </ControlRow>

      <ControlRow>
        <ControlGroup>
          <Button
            onClick={() => {
              // Cycle through modes
              const idx = modes.findIndex(mode => overlay.mode === mode) + 1
              setOverlayMode(modes[idx % modes.length])
            }}
          >
            {texts[overlay.mode]}
          </Button>
          {overlay.mode !== 'NONE' && (
            <Button
              onClick={() =>
                setVersusColor(
                  overlay.versus === 'selected' ? 'white' : 'selected'
                )
              }
            >
              vs. {overlay.versus}
            </Button>
          )}
        </ControlGroup>

        <ChartSettings />

        <ThemeButton />
        <Button as="a" href="https://github.com/ardov/huetone">
          <GitHub />
        </Button>
      </ControlRow>
    </Wrapper>
  )
}

const Wrapper = styled.header`
  width: 100%;
  display: flex;
  padding: 16px;
  border-bottom: 1px solid var(--c-divider);
  justify-content: space-between;
`
const ControlRow = styled.main`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
