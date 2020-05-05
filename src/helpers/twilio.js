const Video = require('twilio-video')

Video.createLocalTracks().then(function (localTracks) {
  var localMediaContainer = document.getElementById('local-media-container-id')
  localTracks.forEach(function (track) {
    localMediaContainer.appendChild(track.attach())
  })
})
/* // Option 1
createLocalTracks({
  audio: true,
  video: { width: 640 },
})
  .then((localTracks) => {
    return connect('$TOKEN', {
      name: 'my-room-name',
      tracks: localTracks,
    })
  })
  .then((room) => {
    console.log(`Connected to Room: ${room.name}`)
  })

// Option 2
connect('$TOKEN', {
  audio: true,
  name: 'my-room-name',
  video: { width: 640 },
}).then((room) => {
  console.log(`Connected to Room: ${room.name}`)
}) */

Video.connect('$TOKEN', { name: 'room-name' }).then((room) => {
  console.log('Connected to Room "%s"', room.name)

  room.participants.forEach(participantConnected)
  room.on('participantConnected', participantConnected)

  room.on('participantDisconnected', participantDisconnected)
  room.once('disconnected', (error) =>
    room.participants.forEach(participantDisconnected)
  )
})

function participantConnected(participant) {
  console.log('Participant "%s" connected', participant.identity)

  const div = document.createElement('div')
  div.id = participant.sid
  div.innerText = participant.identity

  participant.on('trackSubscribed', (track) => trackSubscribed(div, track))
  participant.on('trackUnsubscribed', trackUnsubscribed)

  participant.tracks.forEach((publication) => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track)
    }
  })

  document.body.appendChild(div)
}

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity)
  document.getElementById(participant.sid).remove()
}

function trackSubscribed(div, track) {
  div.appendChild(track.attach())
}

function trackUnsubscribed(track) {
  track.detach().forEach((element) => element.remove())
}

// Attach the Participant's Media to a <div> element.
room.on('participantConnected', (participant) => {
  console.log(`Participant "${participant.identity}" connected`)

  participant.tracks.forEach((publication) => {
    if (publication.isSubscribed) {
      const track = publication.track
      document.getElementById('remote-media-div').appendChild(track.attach())
    }
  })

  participant.on('trackSubscribed', (track) => {
    document.getElementById('remote-media-div').appendChild(track.attach())
  })
})
