import { createGlobalStyle } from 'styled-components'

export const COLORS = {
  default: '#FFF',
  background: 'hsl(226, 100%, 97%)',
  focus: 'hsl(228, 96%, 89%)',
  accent: 'hsl(239, 84%, 67%)',
  textPrimary: 'hsl(215, 28%, 17%)',
  textSecondary: 'hsl(220, 9%, 46%)',
  textHint: 'hsl(218, 11%, 65%)',
  textOnAccent: '#FFF',
}

const GlobalStyles = createGlobalStyle`
  /* CSS Variables */
  :root {
    /* COLORS */
    --c-gray0: ${COLORS.default};
    --c-gray1: ${COLORS.default};
    --c-gray2: hsl(210, 3%, 17%);
    --c-accent: ${COLORS.accent};
    --c-text-primary: ${COLORS.textPrimary};
    --c-text-secondary: ${COLORS.textSecondary};
    --c-text-hint: ${COLORS.textHint};
    --c-input-bg: ${COLORS.background};
    --c-input-bg-hover: ${COLORS.focus};
    --c-input-bg-focus: ${COLORS.focus};
    --c-bg: ${COLORS.default};
    --c-textOnAccent: ${COLORS.textOnAccent};

    --c-hover: ${COLORS.background};
    --c-focus: ${COLORS.focus};

    /* SHAPE */
    --radius-m: 6px;
    --radius-l: 24px;
  }

  /* CSS Reset from https://piccalil.li/blog/a-modern-css-reset */
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin */
  body, h1, h2, h3, h4, p, figure, blockquote, dl, dd {
    margin: 0;
  }

  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ul[role='list'],
  ol[role='list'] {
    list-style: none;
  }

  /* Set core root defaults */
  html:focus-within {
    scroll-behavior: smooth;
  }

  /* Set core body defaults */
  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
    scroll-behavior: auto;
    }
    
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  

  html {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--c-text-primary);
    background: var(---c-bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--c-gray1);
  }

  html, body, #root {
    height: 100%;
    min-height: 100%;
  }

  /* ::-webkit-scrollbar-track {} */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--c-text-hint);
    border-radius: 2px;
  }
`

export default GlobalStyles
