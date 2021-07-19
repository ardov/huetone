import React, { FC, Fragment, useEffect } from 'react'
import styled from 'styled-components'
import { clampLch, getMostContrast, toHex, wcagContrast } from '../color'
import {
  renameHue,
  renameTone,
  reorderHues,
  reorderTones,
  setColor,
} from '../palette'
import { Palette } from '../types'
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
  const lPress = useKeyPress('l')
  const cPress = useKeyPress('c')
  const hPress = useKeyPress('h')
  const { hues, tones, colors } = palette
  const [selectedHue, selectedTone] = selected
  const hexColors = colors.map(arr => arr.map(toHex))
  const selectedColorLch = colors[selectedHue][selectedTone]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()

          if (lPress || cPress || hPress) {
            // MODIFY COLOR
            let [l, c, h] = selectedColorLch
            if (lPress) l += 0.5
            if (cPress) c += 0.5
            if (hPress) h += 0.5
            onPaletteChange(
              setColor(palette, clampLch([l, c, h]), selectedHue, selectedTone)
            )
            break
          }

          if (selectedHue > 0) {
            // MOVE HUE UP
            if (e.metaKey) {
              onPaletteChange(
                reorderHues(palette, selectedHue, selectedHue - 1)
              )
              onSelect([selectedHue - 1, selectedTone])
              break
            }

            // SELECT COLOR ABOVE
            onSelect([selectedHue - 1, selectedTone])
          }
          break

        case 'ArrowDown':
          e.preventDefault()

          if (lPress || cPress || hPress) {
            // MODIFY COLOR
            let [l, c, h] = selectedColorLch
            if (lPress) l -= 0.5
            if (cPress) c -= 0.5
            if (hPress) h -= 0.5
            onPaletteChange(
              setColor(palette, clampLch([l, c, h]), selectedHue, selectedTone)
            )
            break
          }

          if (selectedHue < hues.length - 1) {
            if (e.metaKey) {
              // MOVE HUE DOWN
              onPaletteChange(
                reorderHues(palette, selectedHue, selectedHue + 1)
              )
              onSelect([selectedHue + 1, selectedTone])
              break
            }

            // SELECT COLOR BELOW
            onSelect([selectedHue + 1, selectedTone])
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (selectedTone > 0) {
            if (e.metaKey) {
              // MOVE TONE LEFT
              onPaletteChange(
                reorderTones(palette, selectedTone, selectedTone - 1)
              )
              onSelect([selectedHue, selectedTone - 1])
            } else {
              // SELECT COLOR ON THE LEFT
              onSelect([selectedHue, selectedTone - 1])
            }
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (selectedTone < tones.length - 1) {
            if (e.metaKey) {
              // MOVE TONE LEFT
              onPaletteChange(
                reorderTones(palette, selectedTone, selectedTone + 1)
              )
              onSelect([selectedHue, selectedTone + 1])
            } else {
              // SELECT COLOR ON THE LEFT
              onSelect([selectedHue, selectedTone + 1])
            }
          }
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [
    cPress,
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
              contrast={wcagContrast(color, contrastTo)}
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
  const contrastRatio = +contrast.toFixed(1)
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
