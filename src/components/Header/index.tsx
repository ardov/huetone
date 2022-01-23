import { useStore } from '@nanostores/react'
import React from 'react'
import styled from 'styled-components'
import { getPaletteLink, setColor, setPalette } from '../../store/palette'
import { Button, ControlGroup } from '../inputs'
import { ThemeButton } from './ThemeButton'
import { PaletteSelect } from './PaletteSelect'
import { CopyButton } from '../CopyButton'
import { Link } from '../../icons/Link'
import { paletteStore, toggleColorSpace } from '../../store/palette'
import {
  overlayStore,
  setOverlayMode,
  setVersusColor,
} from '../../store/overlay'
import { ColorEditor } from './ColorEditor'
import { ColorActions } from './ColorActions'
import { selectedStore } from '../../store/currentPosition'

export function Header() {
  const palette = useStore(paletteStore)
  const overlay = useStore(overlayStore)
  const selected = useStore(selectedStore)

  return (
    <Wrapper>
      <PaletteSelect />

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

        <CopyButton getContent={() => getPaletteLink(palette)}>
          <Link />
          Copy link
        </CopyButton>

        <ThemeButton />
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
