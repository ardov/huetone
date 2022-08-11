import { createGlobalStyle } from 'styled-components'
import { useColorScheme } from 'shared/hooks/useColorScheme'

const LightStyles = createGlobalStyle`
  :root {
    --c-bg: #ffffff;
    --c-bg-card: #f4f6fe;
    --c-text-primary: hsla(0, 0%, 10%, 1);
    --c-text-secondary: hsla(0, 0%, 0%, 0.64);
    --c-text-hint: hsla(0, 0%, 0%, 0.4);
    --c-text-error: hsl(0, 75%, 37%);
    --c-text-success: #1f881f;

    --c-btn-bg: hsla(0, 0%, 0%, 0.06);
    --c-btn-bg-hover: hsla(0, 0%, 0%, 0.12);
    --c-btn-bg-active: hsla(0, 0%, 0%, 0.2);
    --c-divider: hsla(0, 0%, 0%, 0.1);

    --c-scrollbar: hsla(0, 0%, 0%, 0.12);

    --radius-m: 6px;
    --radius-l: 24px;

    --canvas-filter: none;
  }
`
const DarkStyles = createGlobalStyle`
  :root {
    --c-bg: hsl(227, 64%, 4%);
    --c-bg-card: hsl(227, 14%, 13%);
    --c-text-primary: hsla(0, 0%, 100%, 1);
    --c-text-secondary: hsla(0, 0%, 100%, 0.72);
    --c-text-hint: hsla(0, 0%, 100%, 0.5);
    --c-text-error: hsl(0, 100%, 50%);
    --c-text-success: hsl(120, 94%, 49%);

    --c-btn-bg: hsla(0, 0%, 100%, 0.12);
    --c-btn-bg-hover: hsla(0, 0%, 100%, 0.16);
    --c-btn-bg-active: hsla(0, 0%, 100%, 0.24);
    --c-divider: hsla(0, 0%, 100%, 0.1);

    --c-scrollbar: hsla(0, 0%, 100%, 0.16);

    --radius-m: 6px;
    --radius-l: 24px;

    --canvas-filter: invert(1);
  }
`

export default function GlobalStyles() {
  const [current] = useColorScheme()
  if (current === 'dark') return <DarkStyles />
  return <LightStyles />
}
