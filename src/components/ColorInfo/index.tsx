import React, { FC, useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import { valid } from 'chroma-js'
import styled from 'styled-components'
import { selectedStore } from 'store/currentPosition'
import { paletteStore } from 'store/palette'
import { Input } from '../inputs'
import { ContrastBadgeAPCA, ContrastBadgeWCAG } from './ContrastBadge'

export const ColorInfo: FC = () => {
  const { tones } = useStore(paletteStore)
  return (
    <ContrastStack>
      <ContrastGroup versusColor={tones[0]} />
      <ContrastGroup versusColor={'white'} />
      <ContrastGroup versusColor={'black'} />
    </ContrastStack>
  )
}
const ContrastStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ContrastGroup: FC<{ versusColor: string }> = props => {
  const { color, hueId, toneId } = useStore(selectedStore)
  const { colors, tones, hues } = useStore(paletteStore)
  const hex = color.hex
  const [colorInput, setColorInput] = useState(props.versusColor)
  const [additionalColor, setAdditionalColor] = useState(colors[hueId][0].hex)
  const name = hues[hueId] + '-' + tones[toneId]

  useEffect(() => {
    const i = tones.indexOf(colorInput)
    if (i >= 0) {
      setAdditionalColor(colors[hueId][i].hex)
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
