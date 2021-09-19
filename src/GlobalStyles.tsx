import { createGlobalStyle, css } from 'styled-components'

const whiteTheme = css`
  :root {
    --c-bg: #ffffff;
    --c-bg-card: #dfe3f0;
    --c-text-primary: hsla(0, 0%, 0%, 1);
    --c-text-secondary: hsla(0, 0%, 0%, 0.64);
    --c-text-hint: hsla(0, 0%, 0%, 0.3);

    --c-btn-bg: hsla(0, 0%, 0%, 0.12);
    --c-btn-bg-hover: hsla(0, 0%, 0%, 0.16);
    --c-btn-bg-active: hsla(0, 0%, 0%, 0.24);
    --c-divider: hsla(0, 0%, 0%, 0.1);

    --c-scrollbar: hsla(0, 0%, 0%, 0.16);

    --radius-m: 6px;
    --radius-l: 24px;

    --canvas-filter: none;
  }
`

const GlobalStyles = createGlobalStyle`
  /* ${whiteTheme} */
`

export default GlobalStyles
