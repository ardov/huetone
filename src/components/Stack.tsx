import { FC } from 'react'
import styled from 'styled-components'

type StackProps = {
  vertical?: boolean
  gap?: number
  p?: number
  pt?: number
  pb?: number
  pl?: number
  pr?: number
  m?: number
  mt?: number
  mb?: number
  ml?: number
  mr?: number
  style?: React.CSSProperties
  children: React.ReactNode
}

export const Stack: FC<StackProps> = props => {
  const {
    vertical,
    gap,
    p,
    pt,
    pb,
    pl,
    pr,
    m,
    mt,
    mb,
    ml,
    mr,
    style,
    children,
    ...rest
  } = props
  let padding = [0, 0, 0, 0]
  if (p !== undefined) padding.fill(p)
  if (pt !== undefined) padding[0] = pt
  if (pr !== undefined) padding[1] = pr
  if (pb !== undefined) padding[2] = pb
  if (pl !== undefined) padding[3] = pl
  let margin = [0, 0, 0, 0]
  if (m !== undefined) margin.fill(m)
  if (mt !== undefined) margin[0] = mt
  if (mr !== undefined) margin[1] = mr
  if (mb !== undefined) margin[2] = mb
  if (ml !== undefined) margin[3] = ml

  return (
    <Wrapper
      style={{
        flexDirection: vertical ? 'column' : 'row',
        gap: gap,
        padding: arrayToString(padding),
        margin: arrayToString(margin),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
`

const arrayToString = (arr: (string | number)[]) =>
  arr.map(v => (typeof v === 'number' ? v + 'px' : v)).join(' ')
