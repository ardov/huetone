import React, { FC } from 'react'
import styled from 'styled-components'
import { apcaContrast, wcagContrast } from '../../color'

export const ContrastBadgeAPCA: FC<{ background: string; color: string }> = ({
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
  const displayCr = Math.floor(cr * 10) / 10

  return (
    <Wrapper>
      <Preview style={{ background, color }}>APCA</Preview>
      <Info style={{ color: cr < 30 ? 'red' : cr >= 60 ? 'green' : 'black' }}>
        <strong>{displayCr}</strong> – {rating}
      </Info>
    </Wrapper>
  )
}
export const ContrastBadgeWCAG: FC<{ background: string; color: string }> = ({
  background,
  color,
}) => {
  const cr = wcagContrast(background, color)
  let rating = ''
  if (cr >= 7) rating = 'AAA'
  else if (cr >= 4.5) rating = 'AA (normal), AAA (large)'
  else if (cr >= 3) rating = 'AA (large & UI components)'
  else rating = 'Fail'
  const displayCr = Math.floor(cr * 10) / 10

  return (
    <Wrapper>
      <Preview style={{ background, color }}>WCAG</Preview>
      <Info style={{ color: cr < 3 ? 'red' : cr >= 4.5 ? 'green' : 'black' }}>
        <strong>{displayCr}</strong> – {rating}
      </Info>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border-radius: 6px;
`
const Preview = styled.span`
  width: 100%;
  line-height: 40px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
`
const Info = styled.span`
  line-height: 20px;
  font-size: 14px;
  padding: 8px;
`
