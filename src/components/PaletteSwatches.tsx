import React, { FC, Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import { clampLch, getMostContrast, toHex, wcagContrast } from '../color'
import {
  duplicateHue,
  duplicateTone,
  renameHue,
  renameTone,
  reorderHues,
  reorderTones,
  setColor,
} from '../palette'
import { LCH, Palette } from '../types'
import { useKeyPress } from '../useKeyPress'

const SWATCH_WIDTH = '48px'
const SWATCH_HEIGHT = '48px'

type PaletteSwatchesProps = {
  palette: Palette
  selected: [number, number]
  contrastTo: string
  onSelect: (selected: [number, number]) => void
  onPaletteChange: (palette: Palette) => void
}

export const PaletteSwatches: FC<PaletteSwatchesProps> = ({
  palette,
  selected,
  contrastTo,
  onSelect,
  onPaletteChange,
}) => {
  const wPress = useKeyPress('w')
  const lPress = useKeyPress('l')
  const cPress = useKeyPress('c')
  const hPress = useKeyPress('h')
  const [copiedColor, setCopiedColor] = useState<LCH>([0, 0, 0])
  const { hues, tones, colors } = palette
  const [selectedHue, selectedTone] = selected
  const hexColors = colors.map(arr => arr.map(toHex))
  const selectedColorLch = colors[selectedHue][selectedTone]

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Copy color
      if (e.metaKey && e.key === 'c') {
        e.preventDefault()
        setCopiedColor([...selectedColorLch] as LCH)
        return
      }

      // Paste color
      if (e.metaKey && e.key === 'v') {
        e.preventDefault()
        onPaletteChange(
          setColor(palette, copiedColor, selectedHue, selectedTone)
        )
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
              color={color}
              contrast={wcagContrast(color, wPress ? 'white' : contrastTo)}
              isSelected={hue === selectedHue && tone === selectedTone}
              onSelect={() => onSelect([hue, tone])}
            />
          ))}
        </Fragment>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ columns: number; rows: number }>`
  display: grid;
  grid-template-columns: 80px repeat(
      ${p => p.columns},
      minmax(34px, max-content)
    );
`

const HueInput = styled.input`
  border: 0;
  padding: 0;
  background: transparent;
`
const ToneInput = styled(HueInput)`
  width: ${SWATCH_WIDTH};
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
  width: ${SWATCH_WIDTH};
  height: ${SWATCH_HEIGHT};
  border: ${p =>
    p.isSelected
      ? '6px solid var(--c-bg, white)'
      : '0px solid var(--c-bg, white)'};
  border-radius: 0;
  transition: 100ms ease-in-out;
`
