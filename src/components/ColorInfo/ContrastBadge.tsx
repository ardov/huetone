import React, { FC } from 'react'
import styled from 'styled-components'
import { apcaContrast, wcagContrast } from 'shared/color'

export const ContrastBadgeAPCA: FC<{ background: string; color: string }> = ({
  background,
  color,
}) => {
  const cr = apcaContrast(background, color)
  const displayCr = Math.floor(cr * 10) / 10
  return (
    <Wrapper>
      <Preview style={{ background, color }}>APCA</Preview>
      <Info style={{ color: getAPCAColor(cr) }}>
        <strong>{displayCr}</strong> – {getAPCAComment(cr)}
      </Info>
    </Wrapper>
  )
}

export const ContrastBadgeWCAG: FC<{ background: string; color: string }> = ({
  background,
  color,
}) => {
  const cr = wcagContrast(background, color)
  const displayCr = Math.floor(cr * 10) / 10
  return (
    <Wrapper>
      <Preview style={{ background, color }}>WCAG</Preview>
      <Info style={{ color: getWCAGColor(cr) }}>
        <strong>{displayCr}</strong> – {getWCAGComment(cr)}
      </Info>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  background-color: var(--c-bg-card);
  border-radius: var(--radius-m);
`
const Preview = styled.span`
  width: 100%;
  line-height: 40px;
  border-radius: var(--radius-m);
  box-shadow: inset 0 0 0 1px var(--c-divider);
`
const Info = styled.span`
  line-height: 20px;
  font-size: 14px;
  padding: 8px;
`

function getAPCAComment(cr: number) {
  if (cr >= 75) return 'Best for text'
  if (cr >= 68.95 && cr <= 69.05) return 'Nice'
  if (cr >= 60) return 'Ok for text'
  if (cr >= 45) return 'Only large text'
  if (cr >= 30) return 'Not for reading text'
  if (cr >= 15) return 'Not for any text'
  return 'Fail'
}
function getAPCAColor(cr: number) {
  if (cr >= 60) return 'var(--c-text-success)'
  if (cr < 30) return 'var(--c-text-error)'
  return 'var(--c-text-primary)'
}
function getWCAGComment(cr: number) {
  if (cr >= 7.0) return 'AAA'
  if (cr >= 4.5) return 'AA (normal), AAA (large)'
  if (cr >= 3.0) return 'AA (large & UI components)'
  return 'Fail'
}
function getWCAGColor(cr: number) {
  if (cr >= 4.5) return 'var(--c-text-success)'
  if (cr < 3) return 'var(--c-text-error)'
  return 'var(--c-text-primary)'
}
