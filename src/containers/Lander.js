import React from 'react'
import { H1, H2, P, Button, BodyWrapper } from '../components'
import { withRouter, useHistory } from 'react-router-dom'

const Lander = () => {
  const history = useHistory()
  const signIn = () => {
    history.push('/signin')
  }

  return (
    <BodyWrapper>
      <H1>Connect and Play</H1>
      <H2>Video, Chat, Games</H2>
      <P>
        <li>Share Photos!</li>
        <li>Watch Videos!</li>
        <li>Play Games!</li>
      </P>
      <Button onClick={signIn}>Sign In</Button>
    </BodyWrapper>
  )
}

export default withRouter(Lander)
