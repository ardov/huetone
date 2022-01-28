import styled from 'styled-components'

export const Button = styled.button`
  cursor: pointer;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: var(--c-text-secondary);
  border-radius: var(--radius-m);
  background-color: var(--c-btn-bg);
  font-size: 14px;
  line-height: 20px;
  padding: 6px 8px;
  transition: 100ms ease-out;

  :hover {
    color: var(--c-text-primary);
    background-color: var(--c-btn-bg-hover);
  }

  :active {
    background-color: var(--c-btn-bg-active);
    transform: translateY(1px);
    transition: 100ms ease-out;
  }

  :focus {
    outline: 1px solid var(--c-text-primary);
    outline-offset: 3px;
  }
  :focus:not(:focus-visible) {
    outline: none;
  }
`

export const Select = styled(Button.withComponent('select'))`
  :active {
    /* Transform closes select on Firefox (or not) */
    transform: none;
  }
`

export const InvisibleInput = styled.input`
  border: none;
  color: var(--c-text-secondary);
  padding: 0;
  background: transparent;
  transition: 100ms;

  :hover {
    color: var(--c-text-primary);
  }

  :focus {
    outline: none;
    color: var(--c-text-primary);
  }
`

export const Input = styled.input`
  border: 1px solid transparent;
  border-radius: var(--radius-m);
  color: var(--c-text-primary);
  background: var(--c-btn-bg);
  padding: 5px 8px;
  font-size: 14px;
  line-height: 20px;
  transition: 100ms;

  :focus {
    outline: none;
    border-color: var(--c-text-primary);
    color: var(--c-text-primary);
  }
`

export const TextArea = Input.withComponent('textarea')

export const ControlGroup = styled.div`
  display: flex;
  gap: 1px;
  & > * {
    border-radius: 0;
  }
  & > *:first-child {
    border-top-left-radius: var(--radius-m);
    border-bottom-left-radius: var(--radius-m);
  }
  & > *:last-child {
    border-top-right-radius: var(--radius-m);
    border-bottom-right-radius: var(--radius-m);
  }
`
