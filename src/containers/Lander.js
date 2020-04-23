/** @jsx jsx */
import { jsx, Button } from 'theme-ui'
import { H1, P, BodyWrapper } from '../components'
import { withRouter, useHistory } from 'react-router-dom'

const Lander = () => {
  const history = useHistory()
  const signIn = () => {
    history.push('/signin')
  }

  return (
    <BodyWrapper>
      <H1>Connect and Play</H1>
      <P>
        Join your friends in <b>group video chatrooms</b> where you <br />
        can <b>play games, watch videos, and scan social media</b> together.
      </P>
      <Button variant='flatgreen' onClick={signIn}>
        Sign In
      </Button>
    </BodyWrapper>
  )
}

export default withRouter(Lander)
