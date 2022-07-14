import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import AppRoutes from './routes/routes'
import { Typography } from '@mui/material'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* <Typography variant='h3' variantMapping='h1'>
      HEADER
    </Typography> */}
    <AppRoutes />
    {/* <Typography variant='h3' variantMapping='h1'>
      FOOTER
    </Typography> */}
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
