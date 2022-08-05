import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import AppRoutes from './routes/routes'
import { CssBaseline, GlobalStyles } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { mergeThemes } from '../src/utils/theme'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* Header here */}
    <ThemeProvider theme={mergeThemes()}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: '#19191A' },
          a: { fontFamily: 'GeneralSans-Regular', color: '#ffffff' },
        }}
      />
      <StyledEngineProvider injectFirst>
        <AppRoutes />
      </StyledEngineProvider>
    </ThemeProvider>
    {/* Footer here */}
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
module.hot.accept()
