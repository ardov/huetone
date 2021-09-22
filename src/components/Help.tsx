import { FC } from 'react'
import styled from 'styled-components'

export const Help: FC = props => {
  return (
    <Wrapper>
      <h3>Hotkeys</h3>
      <List role="list">
        <li>
          <Key>↑</Key> <Key>↓</Key> <Key>→</Key> <Key>←</Key> — select another
          color
        </li>
        <li>
          <Key>⌘</Key> + <Key>↑</Key> <Key>↓</Key> <Key>→</Key> <Key>←</Key> —
          move rows and columns
        </li>
        <li>
          <Key>⌘</Key> + <Key>⇧</Key> + <Key>↑</Key> <Key>↓</Key> <Key>→</Key>{' '}
          <Key>←</Key> — duplicate rows and columns
        </li>
        <li>
          <Key>L</Key> + <Key>↑</Key> <Key>↓</Key> — change lightness of
          selected color
        </li>
        <li>
          <Key>C</Key> + <Key>↑</Key> <Key>↓</Key> — change chroma of selected
          color
        </li>
        <li>
          <Key>H</Key> + <Key>↑</Key> <Key>↓</Key> — change hue of selected
          color
        </li>
        <li>
          <Key>⌘</Key> + <Key>C</Key> — copy selected color. You can even paste
          it somewhere as HEX
        </li>
        <li>
          <Key>⌘</Key> + <Key>V</Key> — paste color. Just copy color in any
          format and paste it here.
        </li>
        <li>
          Hold <Key>B</Key> — preview palette in greys.
        </li>
      </List>

      <p>
        Made by <Link href="https://ardov.me">Alexey Ardov</Link>.
      </p>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  /* display: flex; */
`
const List = styled.ul`
  padding-left: 0;
  & > li {
    margin-top: 12px;
  }
  & > li:first-child {
    margin-top: 0;
  }
`
const Key = styled.span`
  display: inline-block;
  padding: 0px 0px;
  text-align: center;
  min-width: 24px;
  border-radius: 4px;
  background-color: var(--c-btn-bg);
  border: 1px solid var(--c-divider);
`

const Link = styled.a`
  color: inherit;
  text-decoration-color: var(--c-text-secondary);
  :hover {
    color: var(--c-text-primary);
    text-decoration: none;
  }
`
