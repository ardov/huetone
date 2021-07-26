import React, { FC } from 'react'
import styled from 'styled-components'
import { apcaContrast, toHex, wcagContrast } from '../color'
import { LCH } from '../types'

type ColorInfoProps = {
  color: LCH
  onChange: (color: LCH) => void
}

export const ColorInfo: FC<ColorInfoProps> = ({ color, onChange }) => {
  // const [l, c, h] = color

  const hex = toHex(color)

  return (
    <Wrapper>
      <h4>APCA</h4>
      <p>
        <ContrastBadgeAPCA background={hex} color={'white'} />
        <ContrastBadgeAPCA background={'white'} color={hex} />
      </p>
      <p>
        <ContrastBadgeAPCA background={hex} color={'black'} />
        <ContrastBadgeAPCA background={'black'} color={hex} />
      </p>

      <h4>WCAG</h4>
      <p>
        <ContrastBadgeWCAG background={'black'} color={hex} />
        <ContrastBadgeWCAG background={'white'} color={hex} />
      </p>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ContrastBadgeAPCA: FC<{ background: string; color: string }> = ({
  background,
  color,
}) => {
  const cr = apcaContrast(background, color)
  let rating = ''
  if (cr >= 75) rating = 'AAA'
  else if (cr >= 60) rating = 'AA'
  else if (cr >= 45) rating = 'Only large text'
  else if (cr >= 30) rating = 'Only non-reading text'
  else if (cr >= 15) rating = 'Only non-text'
  else rating = 'Fail'

  return (
    <Badge>
      <Preview style={{ background, color }}>Aa</Preview>
      <span>
        {rating} ({+cr.toFixed(1)})
      </span>
    </Badge>
  )
}
const ContrastBadgeWCAG: FC<{ background: string; color: string }> = ({
  background,
  color,
}) => {
  const cr = wcagContrast(background, color)
  let rating = ''
  if (cr >= 7) rating = 'AAA'
  else if (cr >= 4.5) rating = 'AA for normal and AAA for large text'
  else if (cr >= 3) rating = 'AA for large text or UI components'
  else rating = 'Fail'

  return (
    <Badge>
      <Preview style={{ background, color }}>Aa</Preview>
      <span>
        {rating} ({+cr.toFixed(1)})
      </span>
    </Badge>
  )
}

const Preview = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
`
const Badge = styled.span`
  line-height: 40px;
  padding: 2px 12px 2px 2px;
  display: inline-flex;
  text-align: center;
  gap: 8px;
  border-radius: 50px;
  background: #f6f6f6;
`
