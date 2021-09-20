import React, { FC } from 'react'
import styled from 'styled-components'
import { apcaContrast, wcagContrast } from '../../color'

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

// const Sticker = styled.span`
//   --outline: var(--c-text-primary);
//   line-height: 20px;
//   font-size: 24px;
//   text-shadow: 0 0 1.5px var(--outline), 0 0 1.5px var(--outline),
//     0 0 1.5px var(--outline), 0 0 1.5px var(--outline), 0 0 1.5px var(--outline),
//     0 0 1.5px var(--outline), 0 0 1.5px var(--outline);
// `

function getAPCAComment(cr: number) {
  if (cr >= 75) return 'AAA'
  if (cr >= 60) return 'AA'
  if (cr >= 45) return 'Only large text'
  if (cr >= 30) return 'Only non-reading text'
  if (cr >= 15) return 'Only non-text'
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
