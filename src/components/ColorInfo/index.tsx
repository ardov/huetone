import { valid } from 'chroma-js'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { toHex } from '../../color'
import { Palette } from '../../types'
import { Input } from '../inputs'
import { ContrastBadgeAPCA, ContrastBadgeWCAG } from './ContrastBadge'

type ColorInfoProps = {
  palette: Palette
  selected: [number, number]
}

export const ColorInfo: FC<ColorInfoProps> = ({ palette, selected }) => {
  return (
    <ContrastStack>
      <ContrastGroup
        palette={palette}
        selected={selected}
        color={palette.tones[0]}
      />
      <ContrastGroup palette={palette} selected={selected} color={'white'} />
      <ContrastGroup palette={palette} selected={selected} color={'black'} />
    </ContrastStack>
  )
}
const ContrastStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ContrastGroup: FC<ColorInfoProps & { color: string }> = props => {
  const [hueId, toneId] = props.selected
  const { colors, tones, hues } = props.palette
  const selectedLch = colors[hueId][toneId]
  const hex = toHex(selectedLch)
  const [colorInput, setColorInput] = useState(props.color)
  const [additionalColor, setAdditionalColor] = useState(
    toHex(colors[hueId][0])
  )
  const name = hues[hueId] + '-' + tones[toneId]

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
          {name} vs.{' '}
          <Input
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`
const Heading = styled.div`
  padding-top: 8px;
  grid-column: 1 / -1;
  text-align: center;
`
