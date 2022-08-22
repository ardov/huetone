import * as Menu from '@radix-ui/react-dropdown-menu'
import styled from 'styled-components'

export const Root = Menu.Root

export const Trigger = Menu.Trigger

export const Portal = Menu.Portal

export const Label = styled(Menu.Label)`
  color: var(--c-text-primary);
  font-size: 14px;
  line-height: 20px;
  padding: 6px 6px;
  font-weight: 700;
`

export const Item = styled(Menu.Item)<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  color: var(--c-text-primary);
  font-size: 14px;
  line-height: 20px;
  padding: 6px 6px;
  transition: 100ms ease-out;
  border-radius: var(--radius-m);
  background-color: ${p => (p.selected ? 'var(--c-btn-bg)' : 'transparent')};

  :hover,
  :focus {
    transition: 0ms;
    outline: none;
    background-color: var(--c-btn-bg);
  }

  :active {
    background-color: var(--c-btn-bg-active);
    transition: 100ms ease-out;
  }
`

export const Content = styled(Menu.Content)`
  --c-bg: var(--c-bg-card);
  z-index: 1000;
  padding: 8px 2px;
  border-radius: var(--radius-m);
  background-color: var(--c-bg);
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2));
  max-height: calc(100vh - 64px);
  overflow-y: auto;
`
