import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import AppRoutes from './routes/routes'
import { ThemeProvider, createTheme } from '@mui/material'
import './assets/styles/index.css'

const theme = createTheme({
  typography: {
    fontFamily: [
      'GeneralSans-Variable',
      'GeneralSans-VariableItalic',
      'GeneralSans-Extralight',
      'GeneralSans-ExtralightItalic',
      'GeneralSans-Light',
      'GeneralSans-LightItalic',
      'GeneralSans-Regular',
      'GeneralSans-Italic',
      'GeneralSans-Medium',
      'GeneralSans-MediumItalic',
      'GeneralSans-Semibold',
      'GeneralSans-SemiboldItalic',
      'GeneralSans-Bold',
      'GeneralSans-BoldItalic',
    ].join(','),
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* Header here */}
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
    {/* Footer here */}
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
