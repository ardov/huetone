import chroma from 'chroma-js'
import React, { FC, Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  clampLch,
  getMostContrast,
  toHex,
  toLch,
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
  const lPress = useKeyPress('l')
  const cPress = useKeyPress('c')
  const hPress = useKeyPress('h')
  const bPress = useKeyPress('b')
  const [copiedColor, setCopiedColor] = useState<LCH>([0, 0, 0])
  const { hues, tones, colors } = palette
  const [selectedHue, selectedTone] = selected
  const hexColors = colors.map(arr => arr.map(toHex))
  const selectedColorLch = colors[selectedHue][selectedTone]

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Copy color
      if (e.metaKey && e.key === 'c') {
        navigator.clipboard.writeText(toHex(selectedColorLch))
        setCopiedColor([...selectedColorLch] as LCH)
        return
      }

      // Paste color
      if (e.metaKey && e.key === 'v') {
        navigator.clipboard.readText().then(hex => {
          if (valid(hex))
            onPaletteChange(
              setColor(palette, toLch(hex), selectedHue, selectedTone)
            )
        })
        return
      }

      // Modify color
      if (lPress || cPress || hPress) {
        e.preventDefault()
        let [l, c, h] = selectedColorLch
        if (e.key === 'ArrowUp') {
          if (lPress) l += 0.5
          if (cPress) c += 0.5
          if (hPress) h += 0.5
        }
        if (e.key === 'ArrowDown') {
          if (lPress) l -= 0.5
          if (cPress) c -= 0.5
          if (hPress) h -= 0.5
        }
        onPaletteChange(
          setColor(palette, clampLch([l, c, h]), selectedHue, selectedTone)
        )
        return
      }

      // Move row or column
      if (e.metaKey && !e.shiftKey) {
        e.preventDefault()
        if (e.key === 'ArrowUp' && selectedHue > 0) {
          onPaletteChange(reorderHues(palette, selectedHue, selectedHue - 1))
          onSelect([selectedHue - 1, selectedTone])
          return
        }
        if (e.key === 'ArrowDown' && selectedHue < hues.length - 1) {
          onPaletteChange(reorderHues(palette, selectedHue, selectedHue + 1))
          onSelect([selectedHue + 1, selectedTone])
          return
        }
        if (e.key === 'ArrowLeft' && selectedTone > 0) {
          onPaletteChange(reorderTones(palette, selectedTone, selectedTone - 1))
          onSelect([selectedHue, selectedTone - 1])
          return
        }
        if (e.key === 'ArrowRight' && selectedTone < tones.length - 1) {
          onPaletteChange(reorderTones(palette, selectedTone, selectedTone + 1))
          onSelect([selectedHue, selectedTone + 1])
          return
        }
      }

      // Duplicate row or column
      if (e.metaKey && e.shiftKey) {
        e.preventDefault()
        if (e.key === 'ArrowUp') {
          onPaletteChange(duplicateHue(palette, selectedHue, selectedHue))
          return
        }
        if (e.key === 'ArrowDown') {
          onPaletteChange(duplicateHue(palette, selectedHue, selectedHue + 1))
          onSelect([selectedHue + 1, selectedTone])
          return
        }
        if (e.key === 'ArrowLeft') {
          onPaletteChange(duplicateTone(palette, selectedTone, selectedTone))
          onSelect([selectedHue, selectedTone])
          return
        }
        if (e.key === 'ArrowRight') {
          onPaletteChange(
            duplicateTone(palette, selectedTone, selectedTone + 1)
          )
          onSelect([selectedHue, selectedTone + 1])
          return
        }
      }

      // Select color
      if (e.key === 'ArrowUp' && selectedHue > 0) {
        e.preventDefault()
        onSelect([selectedHue - 1, selectedTone])
        return
      }
      if (e.key === 'ArrowDown' && selectedHue < hues.length - 1) {
        e.preventDefault()
        onSelect([selectedHue + 1, selectedTone])
        return
      }
      if (e.key === 'ArrowLeft' && selectedTone > 0) {
        e.preventDefault()
        onSelect([selectedHue, selectedTone - 1])
        return
      }
      if (e.key === 'ArrowRight' && selectedTone < tones.length - 1) {
        e.preventDefault()
        onSelect([selectedHue, selectedTone + 1])
        return
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
          onKeyDown={e => e.stopPropagation()}
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
          <HueInput
            key={hue}
            value={hues[hue]}
            onKeyDown={e => e.stopPropagation()}
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
  grid-template-columns: 64px repeat(${p => p.columns}, 48px) 16px;
  grid-template-rows: 24px repeat(${p => p.rows}, 48px) 16px;
`

const HueInput = styled.input`
  border: 0;
  padding: 0;
  background: transparent;
`
const ToneInput = styled(HueInput)`
  text-align: center;
  padding: 4px 0;
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
  return (
    <SwatchWrapper
      style={{
        backgroundColor: color,
        color: getMostContrast(color, ['black', 'white']),
      }}
      isSelected={isSelected}
      onClick={onSelect}
    >
      <span>{contrastRatio}</span>
    </SwatchWrapper>
  )
}

const SwatchWrapper = styled.button<{ isSelected: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${p =>
    p.isSelected
      ? '6px solid var(--c-bg, white)'
      : '0px solid var(--c-bg, white)'};
  border-radius: 0;
  transition: 100ms ease-in-out;
`

const SmallButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 16px;
  opacity: 0;
  transition: 200ms ease-in-out;

  :hover {
    background: var(--c-input-bg-hover);
  }

  ${Wrapper}:hover & {
    opacity: 1;
  }
`
