import firebase from '../firebase.js'

const functions = firebase.functions()

export const sendPushNotification = (data) => {
  if (data.token) {
    const push = firebase.functions().httpsCallable('sendPushNotification')
    push({
      token: data.token,
      title: data.title,
      body: data.body,
    })
  }
}

export const getToken = (data) => {
  if (data.roomId) {
    const get = functions.httpsCallable('getToken')
    get({
      roomId: data.roomId,
      username: data.username,
    })
      .then((r) => console.log(r))
      .catch((e) => console.log(e))
  }
}
