import React from 'react'
import { H1, H2, P, Button, BodyWrapper } from '../components'
import { withRouter } from 'react-router-dom'

const Lander = props => {
  const signIn = () => {
    props.history.push('/signin')
  }

  return (
    <BodyWrapper>
      <H1>Cliqsee</H1>
      <H2>Hang out with your friends</H2>
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
