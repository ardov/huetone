import React from 'react'
import { createRoot } from 'react-dom/client'
import { ColorSchemeProvider } from 'shared/hooks/useColorScheme'
import GlobalStyles from 'components/GlobalStyles'
import App from 'components/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import './styles.scss'

const container = document.getElementById('root')
createRoot(container!).render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <GlobalStyles />
      <App />
    </ColorSchemeProvider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
