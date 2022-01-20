import { useStore } from '@nanostores/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FC } from 'react'
import styled from 'styled-components'
import { paletteListStore } from '../store/paletteList'
import { Button } from './inputs'

export const PaletteSelect: FC<{ currentIdx: number }> = props => {
  const { currentIdx } = props
  const paletteList = useStore(paletteListStore)
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button>{paletteList[currentIdx].name}</Button>
      </DropdownMenu.Trigger>

      <StyledContent align="start" sideOffset={4}>
        <StyledLabel>Palettes</StyledLabel>
        {paletteList.map((p, i) => {
          return <StyledOption key={i}>{p.name}</StyledOption>
        })}
      </StyledContent>
    </DropdownMenu.Root>
  )
}

const StyledLabel = styled(DropdownMenu.Label)`
  color: var(--c-text-primary);
  font-size: 14px;
  line-height: 20px;
  padding: 6px 8px;
  font-weight: 700;
`
const StyledOption = styled(DropdownMenu.Item)`
  cursor: pointer;
  color: var(--c-text-primary);
  font-size: 14px;
  line-height: 20px;
  padding: 6px 8px;
  transition: 100ms ease-out;

  :hover,
  :focus {
    outline: none;
    background-color: var(--c-btn-bg);
  }

  :active {
    background-color: var(--c-btn-bg-active);
    transition: 100ms ease-out;
  }
`

const StyledContent = styled(DropdownMenu.Content)`
  padding: 8px 0;
  border-radius: var(--radius-m);
  background-color: var(--c-bg-card);
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
`
