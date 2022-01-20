import chroma from 'chroma-js'
import React, { FC, Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import { getMostContrast, wcagContrast, apcaContrast } from '../color'
import {
  addHue,
  addTone,
  duplicateHue,
  duplicateTone,
  removeHue,
  removeTone,
  renameHue,
  renameTone,
  reorderHues,
  reorderTones,
  setColor,
} from '../palette'
import { LCH } from '../types'
import { useKeyPress } from '../hooks/useKeyPress'
import { Button, InvisibleInput } from './inputs'
import { useStore } from '@nanostores/react'
import { colorSpaceStore, paletteStore, setPalette } from '../store/palette'
import { selectedStore, setSelected } from '../store/currentPosition'
import { overlayStore, versusColorStore } from '../store/overlay'

const contrast = {
  WCAG: wcagContrast,
  APCA: apcaContrast,
  NONE: () => undefined,
}

export const PaletteSwatches: FC = () => {
  const { hex2color } = useStore(colorSpaceStore)
  const palette = useStore(paletteStore)
  const selected = useStore(selectedStore)
  const overlay = useStore(overlayStore)
  const versusColor = useStore(versusColorStore)

  const lPress = useKeyPress('KeyL')
  const cPress = useKeyPress('KeyC')
  const hPress = useKeyPress('KeyH')
  const bPress = useKeyPress('KeyB')
  const [copiedColor, setCopiedColor] = useState<LCH>([0, 0, 0])
  const { hues, tones, colors } = palette
  const hexColors = colors.map(arr => arr.map(color => color.hex))

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const { key, metaKey, ctrlKey, shiftKey, code } = e
      const metaPressed = metaKey || ctrlKey
      if (!filterInput(e)) return

      const noDefault = (func: () => any) => {
        e.preventDefault()
        func()
      }

      if (metaPressed && code === 'KeyC') return copyCurrent()
      if (metaPressed && code === 'KeyV') return pasteToCurrent()
      if (code === 'Escape') {
        // @ts-ignore
        return e?.target?.blur()
      }

      // Modify color
      if (lPress || cPress || hPress) {
        e.preventDefault()
        let { l, c, h } = selected.color
        if (key === 'ArrowUp') {
          if (lPress) l += 0.5
          if (cPress) c += 0.5
          if (hPress) h += 0.5
        }
        if (key === 'ArrowDown') {
          if (lPress) l -= 0.5
          if (cPress) c -= 0.5
          if (hPress) h -= 0.5
        }
        setPalette(
          setColor(palette, [l, c, h], selected.hueId, selected.toneId)
        )
        return
      }

      // Duplicate row or column
      if (metaPressed && shiftKey) {
        if (key === 'ArrowUp') return noDefault(duplicateUp)
        if (key === 'ArrowDown') return noDefault(duplicateDown)
        if (key === 'ArrowLeft') return noDefault(duplicateLeft)
        if (key === 'ArrowRight') return noDefault(duplicateRight)
      }

      // Move row or column
      if (metaPressed) {
        if (key === 'ArrowUp') return noDefault(moveRowUp)
        if (key === 'ArrowDown') return noDefault(moveRowDown)
        if (key === 'ArrowLeft') return noDefault(moveColumnLeft)
        if (key === 'ArrowRight') return noDefault(moveColumnRight)
      }

      // Select color
      if (key === 'ArrowUp') return noDefault(selectUp)
      if (key === 'ArrowDown') return noDefault(selectDown)
      if (key === 'ArrowLeft') return noDefault(selectLeft)
      if (key === 'ArrowRight') return noDefault(selectRight)

      function copyCurrent() {
        e.preventDefault()
        let toCopy = selected.color.hex
        let { l, c, h } = selected.color
        setCopiedColor([l, c, h] as LCH)
        navigator.clipboard.writeText(toCopy)
        if (navigator.clipboard) {
          navigator.clipboard.writeText(toCopy)
        } else {
          // text area method
          let textArea = document.createElement('textarea')
          textArea.value = toCopy
          // make the textarea out of viewport
          textArea.style.position = 'absolute'
          textArea.style.opacity = '0'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy')
          textArea.remove()
        }
      }
      function pasteToCurrent() {
        navigator.clipboard.readText().then(hex => {
          let color = hex2color(hex)
          if (color) {
            let { l, c, h } = color
            setPalette(
              setColor(palette, [l, c, h], selected.hueId, selected.toneId)
            )
          }
        })
      }

      function moveRowUp() {
        if (selected.hueId <= 0) return
        setPalette(reorderHues(palette, selected.hueId, selected.hueId - 1))
        setSelected([selected.hueId - 1, selected.toneId])
      }
      function moveRowDown() {
        if (selected.hueId >= hues.length - 1) return
        setPalette(reorderHues(palette, selected.hueId, selected.hueId + 1))
        setSelected([selected.hueId + 1, selected.toneId])
      }
      function moveColumnLeft() {
        if (selected.toneId <= 0) return
        setPalette(reorderTones(palette, selected.toneId, selected.toneId - 1))
        setSelected([selected.hueId, selected.toneId - 1])
      }
      function moveColumnRight() {
        if (selected.toneId >= tones.length - 1) return
        setPalette(reorderTones(palette, selected.toneId, selected.toneId + 1))
        setSelected([selected.hueId, selected.toneId + 1])
      }

      function duplicateUp() {
        setPalette(duplicateHue(palette, selected.hueId, selected.hueId))
      }
      function duplicateDown() {
        setPalette(duplicateHue(palette, selected.hueId, selected.hueId + 1))
        setSelected([selected.hueId + 1, selected.toneId])
      }
      function duplicateLeft() {
        setPalette(duplicateTone(palette, selected.toneId, selected.toneId))
        setSelected([selected.hueId, selected.toneId])
      }
      function duplicateRight() {
        setPalette(duplicateTone(palette, selected.toneId, selected.toneId + 1))
        setSelected([selected.hueId, selected.toneId + 1])
      }

      function selectUp() {
        if (selected.hueId <= 0) return
        setSelected([selected.hueId - 1, selected.toneId])
      }
      function selectDown() {
        if (selected.hueId >= hues.length - 1) return
        setSelected([selected.hueId + 1, selected.toneId])
      }
      function selectLeft() {
        if (selected.toneId <= 0) return
        setSelected([selected.hueId, selected.toneId - 1])
      }
      function selectRight() {
        if (selected.toneId >= tones.length - 1) return
        setSelected([selected.hueId, selected.toneId + 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [
    cPress,
    copiedColor,
    hPress,
    hues.length,
    lPress,
    palette,
    selected,
    tones.length,
    hex2color,
  ])

  return (
    <Wrapper columns={tones.length} rows={hues.length}>
      {/* HEADER */}
      <div />
      {tones.map((toneName, tone) => (
        <ToneInput
          key={tone}
          value={toneName}
          onChange={e => setPalette(renameTone(palette, tone, e.target.value))}
        />
      ))}
      <SmallButton
        title="Add tone"
        onClick={() => setPalette(addTone(palette))}
      >
        +
      </SmallButton>

      {/* HUES */}
      {hexColors.map((hueColors, hue) => (
        <Fragment key={hue}>
          <InvisibleInput
            key={hue}
            value={hues[hue]}
            onChange={e => setPalette(renameHue(palette, hue, e.target.value))}
          />
          {hueColors.map((color, tone) => (
            <Swatch
              key={color + tone}
              color={!bPress ? color : chroma(color).desaturate(10).hex()}
              contrast={contrast[overlay.mode](versusColor, color)}
              isSelected={hue === selected.hueId && tone === selected.toneId}
              setSelected={() => setSelected([hue, tone])}
            />
          ))}
          <SmallButton
            title="Delete this row"
            onClick={() => setPalette(removeHue(palette, hue))}
          >
            ×
          </SmallButton>
        </Fragment>
      ))}

      {/* COLUMN BUTTONS */}
      <SmallButton title="Add row" onClick={() => setPalette(addHue(palette))}>
        +
      </SmallButton>
      {tones.map((toneName, tone) => (
        <SmallButton
          key={tone}
          title="Delete this column"
          onClick={() => setPalette(removeTone(palette, tone))}
        >
          ×
        </SmallButton>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ columns: number; rows: number }>`
  display: grid;
  grid-template-columns: 64px repeat(${p => p.columns}, 48px) 24px;
  grid-template-rows: 32px repeat(${p => p.rows}, 48px) 24px;
`

const ToneInput = styled(InvisibleInput)`
  text-align: center;
`

type SwatchProps = {
  color: string
  contrast?: number
  isSelected: boolean
  setSelected: () => void
}

const Swatch: FC<SwatchProps> = props => {
  const { color, isSelected, setSelected, contrast } = props
  const contrastRatio =
    contrast === undefined ? '' : Math.floor(contrast * 10) / 10
  const contrastText = getMostContrast(color, ['black', 'white'])
  const style = { '--bg': color, '--text': contrastText } as React.CSSProperties
  return (
    <SwatchWrapper style={style} isSelected={isSelected} onClick={setSelected}>
      <span style={isSelected ? { fontWeight: 900 } : {}}>{contrastRatio}</span>
    </SwatchWrapper>
  )
}

const SwatchWrapper = styled.button<{ isSelected: boolean }>`
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  display: flex;
  position: relative;
  border: none;
  align-items: center;
  justify-content: center;
  will-change: transform;
  border-radius: ${p => (p.isSelected ? 'var(--radius-m)' : 0)};
  transform: ${p => (p.isSelected ? 'scale(1.25)' : 'scale(1)')};
  z-index: ${p => (p.isSelected ? 3 : 0)};

  :focus {
    outline: none;
  }
`

const SmallButton = styled(Button)`
  background: transparent;
  padding: 0;
  opacity: 0;

  ${Wrapper}:hover & {
    opacity: 1;
  }
`

/** Detects if keyboard input is from editable field */
function filterInput(event: KeyboardEvent) {
  const target = event.target
  if (!target) return true

  // @ts-ignore
  const { tagName, isContentEditable, readOnly } = target
  if (isContentEditable) return false
  // Skip range inputs
  // @ts-ignore
  if (target?.type === 'range') return true
  if (readOnly) return true
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return false
  // @ts-ignore
  if (target?.getAttribute?.('role') === 'menuitem') return false
  console.log(target)
  return true
}
