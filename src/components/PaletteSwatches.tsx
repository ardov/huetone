import { cielch as lch } from '../color2'
import chroma from 'chroma-js'
import React, { FC, Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  clampLch,
  getMostContrast,
  valid,
  wcagContrast,
  apcaContrast,
} from '../color'
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
import { LCH, OverlayMode, Palette } from '../types'
import { useKeyPress } from '../useKeyPress'
import { Button, InvisibleInput } from './inputs'

const { fromHex, toHex } = lch

const contrast = {
  WCAG: wcagContrast,
  APCA: apcaContrast,
}

type PaletteSwatchesProps = {
  palette: Palette
  selected: [number, number]
  overlayMode: OverlayMode
  contrastTo: string
  onSelect: (selected: [number, number]) => void
  onPaletteChange: (palette: Palette) => void
}

export const PaletteSwatches: FC<PaletteSwatchesProps> = ({
  palette,
  selected,
  overlayMode,
  contrastTo,
  onSelect,
  onPaletteChange,
}) => {
  const lPress = useKeyPress('KeyL')
  const cPress = useKeyPress('KeyC')
  const hPress = useKeyPress('KeyH')
  const bPress = useKeyPress('KeyB')
  const [copiedColor, setCopiedColor] = useState<LCH>([0, 0, 0])
  const { hues, tones, colors } = palette
  const [selectedHue, selectedTone] = selected
  const hexColors = colors.map(arr => arr.map(toHex))
  const selectedColorLch = colors[selectedHue][selectedTone]

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
        let [l, c, h] = selectedColorLch
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
        onPaletteChange(
          setColor(palette, clampLch([l, c, h]), selectedHue, selectedTone)
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
        let toCopy = toHex(selectedColorLch)
        setCopiedColor([...selectedColorLch] as LCH)
        navigator.clipboard.writeText(toHex(selectedColorLch))
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
          if (valid(hex))
            onPaletteChange(
              setColor(palette, fromHex(hex), selectedHue, selectedTone)
            )
        })
      }

      function moveRowUp() {
        if (selectedHue <= 0) return
        onPaletteChange(reorderHues(palette, selectedHue, selectedHue - 1))
        onSelect([selectedHue - 1, selectedTone])
      }
      function moveRowDown() {
        if (selectedHue >= hues.length - 1) return
        onPaletteChange(reorderHues(palette, selectedHue, selectedHue + 1))
        onSelect([selectedHue + 1, selectedTone])
      }
      function moveColumnLeft() {
        if (selectedTone <= 0) return
        onPaletteChange(reorderTones(palette, selectedTone, selectedTone - 1))
        onSelect([selectedHue, selectedTone - 1])
      }
      function moveColumnRight() {
        if (selectedTone >= tones.length - 1) return
        onPaletteChange(reorderTones(palette, selectedTone, selectedTone + 1))
        onSelect([selectedHue, selectedTone + 1])
      }

      function duplicateUp() {
        onPaletteChange(duplicateHue(palette, selectedHue, selectedHue))
      }
      function duplicateDown() {
        onPaletteChange(duplicateHue(palette, selectedHue, selectedHue + 1))
        onSelect([selectedHue + 1, selectedTone])
      }
      function duplicateLeft() {
        onPaletteChange(duplicateTone(palette, selectedTone, selectedTone))
        onSelect([selectedHue, selectedTone])
      }
      function duplicateRight() {
        onPaletteChange(duplicateTone(palette, selectedTone, selectedTone + 1))
        onSelect([selectedHue, selectedTone + 1])
      }

      function selectUp() {
        if (selectedHue <= 0) return
        onSelect([selectedHue - 1, selectedTone])
      }
      function selectDown() {
        if (selectedHue >= hues.length - 1) return
        onSelect([selectedHue + 1, selectedTone])
      }
      function selectLeft() {
        if (selectedTone <= 0) return
        onSelect([selectedHue, selectedTone - 1])
      }
      function selectRight() {
        if (selectedTone >= tones.length - 1) return
        onSelect([selectedHue, selectedTone + 1])
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
    onPaletteChange,
    onSelect,
    palette,
    selectedColorLch,
    selectedHue,
    selectedTone,
    tones.length,
  ])

  return (
    <Wrapper columns={tones.length} rows={hues.length}>
      {/* HEADER */}
      <div />
      {tones.map((toneName, tone) => (
        <ToneInput
          key={tone}
          value={toneName}
          onChange={e =>
            onPaletteChange(renameTone(palette, tone, e.target.value))
          }
        />
      ))}
      <SmallButton
        title="Add tone"
        onClick={() => onPaletteChange(addTone(palette))}
      >
        +
      </SmallButton>

      {/* HUES */}
      {hexColors.map((hueColors, hue) => (
        <Fragment key={hue}>
          <InvisibleInput
            key={hue}
            value={hues[hue]}
            onChange={e =>
              onPaletteChange(renameHue(palette, hue, e.target.value))
            }
          />
          {hueColors.map((color, tone) => (
            <Swatch
              key={color + tone}
              color={!bPress ? color : chroma(color).desaturate(10).hex()}
              contrast={contrast[overlayMode](contrastTo, color)}
              isSelected={hue === selectedHue && tone === selectedTone}
              onSelect={() => onSelect([hue, tone])}
            />
          ))}
          <SmallButton
            title="Delete this row"
            onClick={() => onPaletteChange(removeHue(palette, hue))}
          >
            ×
          </SmallButton>
        </Fragment>
      ))}

      {/* COLUMN BUTTONS */}
      <SmallButton
        title="Add row"
        onClick={() => onPaletteChange(addHue(palette))}
      >
        +
      </SmallButton>
      {tones.map((toneName, tone) => (
        <SmallButton
          key={tone}
          title="Delete this column"
          onClick={() => onPaletteChange(removeTone(palette, tone))}
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
  contrast: number
  isSelected: boolean
  onSelect: () => void
}

const Swatch: FC<SwatchProps> = props => {
  const { color, isSelected, onSelect, contrast } = props
  const contrastRatio = Math.floor(contrast * 10) / 10
  const contrastText = getMostContrast(color, ['black', 'white'])
  const style = { '--bg': color, '--text': contrastText } as React.CSSProperties
  return (
    <SwatchWrapper style={style} isSelected={isSelected} onClick={onSelect}>
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
  return true
}
