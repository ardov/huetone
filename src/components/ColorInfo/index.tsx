import { valid } from 'chroma-js'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { toHex } from '../../color'
import { Palette } from '../../types'
import { HexInput, ContrastBadgeAPCA, ContrastBadgeWCAG } from './ContrastBadge'

type ColorInfoProps = {
  palette: Palette
  selected: [number, number]
}

export const ColorInfo: FC<ColorInfoProps> = ({ palette, selected }) => {
  const [hueId, toneId] = selected
  const { colors, tones } = palette
  const selectedLch = colors[hueId][toneId]
  const hex = toHex(selectedLch)
  const [colorInput, setColorInput] = useState(tones[0])
  const [additionalColor, setAdditionalColor] = useState(
    toHex(colors[hueId][0])
  )

  useEffect(() => {
    const i = tones.indexOf(colorInput)
    if (i >= 0) {
      setAdditionalColor(toHex(colors[hueId][i]))
    } else if (valid(colorInput)) {
      setAdditionalColor(colorInput)
    }
  }, [colorInput, colors, hueId, tones])

  return (
    <Wrapper>
      <Heading>
        <h4>
          Contrast vs.{' '}
          <HexInput
            value={colorInput}
            onKeyDown={e => e.stopPropagation()}
            onChange={e => {
              const value = e.target.value
              setColorInput(value)
            }}
          />
        </h4>
      </Heading>
      <ContrastBadgeAPCA background={additionalColor} color={hex} />
      <ContrastBadgeAPCA background={hex} color={additionalColor} />
      <ContrastBadgeWCAG background={additionalColor} color={hex} />

      <Heading>
        <h4>Contrast vs. white</h4>
      </Heading>
      <ContrastBadgeAPCA background={'white'} color={hex} />
      <ContrastBadgeAPCA background={hex} color={'white'} />
      <ContrastBadgeWCAG background={'white'} color={hex} />

      <Heading>
        <h4>Contrast vs. black</h4>
      </Heading>
      <ContrastBadgeAPCA background={hex} color={'black'} />
      <ContrastBadgeAPCA background={'black'} color={hex} />

      <ContrastBadgeWCAG background={'black'} color={hex} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  max-width: 480px;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`
const Heading = styled.div`
  padding-top: 8px;
  grid-column: 1 / -1;
  text-align: center;
`
