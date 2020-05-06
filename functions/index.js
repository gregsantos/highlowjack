const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

const MAX_ALLOWED_SESSION_DURATION = 14400
const twilioAccountSid = functions.config().twilio.account_sid
const twilioApiKeySID = functions.config().twilio.api_key
const twilioApiKeySecret = functions.config().twilio.api_secret

function tokenGenerator(identity, room) {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKeySID,
    twilioApiKeySecret
  )

  // Assign identity to the token
  token.identity = identity

  // Grant the access token Twilio Video capabilities
  const grant = new VideoGrant()
  grant.room = room
  token.addGrant(grant)
  console.log(`issued token for ${identity} in room ${room}`)

  // Serialize the token to a JWT string
  return token.toJwt()
}

exports.getToken = functions.https.onCall((data, context) => {
  const room = data.roomId
  const identity = data.username || 'identity'
  return tokenGenerator(identity, room)
})

exports.sendPushNotification = functions.https.onCall((data, context) => {
  var message = {
    notification: {
      title: data.title,
      body: data.body,
    },
    token: data.token,
  }

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Successfully sent message:', response)
      return
    })
    .catch((error) => {
      console.log('Error sending message:', error)
      return
    })
})

exports.roomFuncs = require('./roomFuncs')
