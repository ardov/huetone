import { FC } from 'react'
import styled from 'styled-components'
import { CSSExportButton, TokenExportButton } from './Export'

export const Help: FC = () => (
  <Wrapper>
    <Export />
    <Hotkeys />
    <Credits />
  </Wrapper>
)

const Export: FC = () => (
  <Section>
    <h3>Exports</h3>

    <p>
      <b>Figma.</b> Install{' '}
      <Link href="https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens">
        Figma Tokens
      </Link>
      . Run the plugin and open JSON tab. Copy tokens and paste there.
    </p>
    <p>
      <TokenExportButton />
    </p>
    <p>
      <CSSExportButton />
    </p>
  </Section>
)

const Hotkeys = () => {
  const isWin = navigator.platform.toUpperCase().indexOf('WIN') >= 0
  const MetaKey = () => (isWin ? <Key>Ctrl</Key> : <Key>⌘</Key>)
  return (
    <Section>
      <h3>Hotkeys</h3>
      <List role="list">
        <li>
          <Key>1</Key> - <Key>9</Key> — switch palette
        </li>
        <li>
          <Key>↑</Key> <Key>↓</Key> <Key>→</Key> <Key>←</Key> — select another
          color
        </li>
        <li>
          <MetaKey /> + <Key>↑</Key> <Key>↓</Key> <Key>→</Key> <Key>←</Key> —
          move rows and columns
        </li>
        <li>
          <MetaKey /> + <Key>⇧</Key> + <Key>↑</Key> <Key>↓</Key> <Key>→</Key>{' '}
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
          <MetaKey /> + <Key>C</Key> — copy selected color as hex.
        </li>
        <li>
          <MetaKey /> + <Key>⇧</Key> + <Key>C</Key> — copy selected color in{' '}
          <Code>oklch()</Code> format. Note that it has limited{' '}
          <Link href="https://caniuse.com/mdn-css_types_color_oklch">browser support</Link>.
        </li>
        <li>
          <MetaKey /> + <Key>V</Key> — paste color. Just copy color in any
          format and paste it here.
        </li>
        <li>
          Hold <Key>B</Key> — preview palette in greys.
        </li>
      </List>
    </Section>
  )
}

const Credits = () => (
  <Section>
    <h3>Credits</h3>
    <p>
      Made by <Link href="https://ardov.me">Alexey Ardov</Link>. Contact me if
      you have any suggestions.
    </p>
    <p>
      Huetone is heavily inspired by{' '}
      <Link href="https://stripe.com/blog/accessible-color-systems">
        that Stripe article
      </Link>
      . And it uses the great{' '}
      <Link href="https://github.com/gka/chroma.js">chroma.js</Link> library
      under the hood.
    </p>
    <p>
      Special thanks for{' '}
      <Link href="https://twitter.com/LeaVerou">Lea Verou</Link>,{' '}
      <Link href="https://twitter.com/svgeesus">Chris Lilley</Link> and the CSS
      working group for providing all the essential code for color conversions.
    </p>
    <p>
      Accessible Perceptual Contrast Algorithm (APCA) by Andrew Somers is a
      WCAG 3 working draft and may change later. To learn more visit{' '}
      <Link href="https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup">
        this page
      </Link>{' '}
      or check{' '}
      <Link href="https://github.com/w3c/wcag/issues/695">
        this thread on GitHub
      </Link>
      .
    </p>
  </Section>
)

const Wrapper = styled.div`
  margin-top: 24px;
`

const Section = styled.section`
  font-size: 16px;
  margin-bottom: 24px;

  p {
    max-width: 60ch;
    margin-top: 12px;
  }
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
  min-width: 28px;
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

const Code = styled.code`
  /* background-color: #eee; */
  border: 1px solid var(--c-divider);
  border-radius: var(--radius-m);
  font-family: courier, monospace;
  padding: 0 3px;
`
