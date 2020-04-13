import React, { useContext, useState, useEffect } from 'react'
import { ThemeProvider } from 'theme-ui'
import firebase from './firebase.js'
import { ToastProvider } from './contexts/toastContext'
import { UserProvider } from './contexts/userContext'
import MainRouter from './MainRouter'
import theme from './themes/theme'

// Create a context and set user: null
const userContext = React.createContext({
  user: null,
})

// Custom Session Hook !!! pass userContext to React useContext Hook
// https://reactjs.org/docs/hooks-reference.html#usecontext
export const useSession = () => {
  const { user } = useContext(userContext)
  return user
}

// Custom Auth Hook !!! set Auth state based on firebase.auth() state
// https://reactjs.org/docs/hooks-custom.html
export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser
    return {
      initializing: !user,
      user,
    }
  })

  // onAuthStateChanged handler
  const onChange = (user) => {
    setState({ initializing: false, user })
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  return state
}

const App = () => {
  // use custom Auth hook to get user
  const { initializing, user } = useAuth()

  // Use Context.Provider to pass userContext down the tree
  return (
    <ThemeProvider theme={theme}>
      <userContext.Provider value={{ user }}>
        <ToastProvider>
          <UserProvider>
            <MainRouter />
          </UserProvider>
        </ToastProvider>
      </userContext.Provider>
    </ThemeProvider>
  )
}

export default App
