import React, { FC } from 'react'
import styled from 'styled-components'
import { toHex } from '../../color'
import { Palette } from '../../types'
import { Stack } from '../Stack'

type ColorInfoProps = {
  palette: Palette
}

export const ExampleUI: FC<ColorInfoProps> = ({ palette }) => {
  return (
    <Stack vertical gap={8} p={24} style={{ background: '#fff' }}>
      <Stack gap={12}>
        {palette.hues.map((name, id) => (
          <ButtonComp key={id} palette={palette} hue={id}>
            {name}
          </ButtonComp>
        ))}
      </Stack>
      <Stack gap={12}>
        {palette.hues.map((name, id) => (
          <ButtonComp key={id} palette={palette} hue={id} use="secondary">
            {name}
          </ButtonComp>
        ))}
      </Stack>
      <Stack gap={12}>
        {palette.hues.map((name, id) => (
          <ButtonComp key={id} palette={palette} hue={id} use="tetriary">
            {name}
          </ButtonComp>
        ))}
      </Stack>
    </Stack>
  )
}

type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
  palette: Palette
  hue: number
  use?: 'primary' | 'secondary' | 'tetriary'
  baseTone?: number
}

const BASE_TONE = 4

export const ButtonComp: FC<ButtonProps> = ({
  palette,
  use = 'primary',
  hue,
  baseTone = BASE_TONE,
  children,
  style,
  ...rest
}) => {
  const colors = palette.colors[hue].map(toHex)
  const useStyle = {
    primary: {
      '--c-bg': colors[baseTone],
      '--c-bg-hover': colors[baseTone + 1],
      '--c-bg-active': colors[baseTone + 2],
      '--c-border': 'transparent',
      '--c-border-hover': 'transparent',
      '--c-border-active': 'transparent',
      '--c-text': 'white',
      '--c-text-hover': 'white',
      '--c-text-active': 'white',
      '--c-text-shadow': 'none', //'0 1px 1px ' + colors[5],
      '--c-focus': alpha(colors[baseTone], 0.3),
    },
    secondary: {
      '--c-bg': alpha(colors[baseTone], 0.1),
      '--c-bg-hover': alpha(colors[baseTone], 0.15),
      '--c-bg-active': alpha(colors[baseTone], 0.2),
      '--c-border': alpha(colors[baseTone], 0.5),
      '--c-border-hover': alpha(colors[baseTone], 0.5),
      '--c-border-active': alpha(colors[baseTone], 0.5),
      '--c-text': colors[5],
      '--c-text-hover': colors[6],
      '--c-text-active': colors[7],
      '--c-text-shadow': 'none',
      '--c-focus': alpha(colors[baseTone], 0.3),
    },
    tetriary: {
      '--c-bg': alpha(colors[baseTone], 0),
      '--c-bg-hover': alpha(colors[baseTone], 0.15),
      '--c-bg-active': alpha(colors[baseTone], 0.2),
      '--c-border': 'transparent',
      '--c-border-hover': 'transparent',
      '--c-border-active': 'transparent',
      '--c-text': colors[5],
      '--c-text-hover': colors[6],
      '--c-text-active': colors[7],
      '--c-text-shadow': 'none',
      '--c-focus': alpha(colors[baseTone], 0.3),
    },
  }
  return (
    // @ts-ignore
    <ButtonBase style={{ ...useStyle[use], ...style }} {...rest}>
      {children}
    </ButtonBase>
  )
}

export const ButtonBase = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  isolation: isolate;
  cursor: pointer;
  user-select: none;
  border-radius: var(--radius-m);
  border: 1px solid var(--c-border);
  background-color: var(--c-bg);
  padding: 3px 8px;
  gap: 8px;
  transition: 100ms ease-in-out;
  box-shadow: 0 0 0 0 var(--c-focus);

  font-size: 14px;
  line-height: 20px;
  color: var(--c-text);
  text-shadow: var(--c-text-shadow);

  :hover {
    background-color: var(--c-bg-hover);
    border-color: var(--c-border-hover);
    color: var(--c-text-hover);
    transition: 150ms ease-in-out;
  }
  :active {
    background-color: var(--c-bg-active);
    border-color: var(--c-border-active);
    color: var(--c-text-active);
    transform: translateY(1px);
    transition: 100ms ease-in-out;
  }

  :focus {
    /* outline: 2px solid var(--c-bg); */
    /* outline-offset: 2px; */
    transition: 150ms ease-in-out;
    outline: none;
    box-shadow: 0 0 0 3px var(--c-focus);
  }

  :focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }
`

const alpha = (hex: string, a?: number) => {
  if (a === undefined || a >= 1) return hex
  if (a <= 0) return 'transparent'
  const opacity = Math.floor(255 * a).toString(16)
  return hex + opacity
}
