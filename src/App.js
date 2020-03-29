import React from 'react'
import { ThemeProvider } from 'theme-ui'
import { ToastProvider } from './contexts/toastContext'
import { UserProvider } from './contexts/userContext'
import MainRouter from './MainRouter'
import theme from './themes/theme'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <UserProvider>
          <MainRouter />
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
