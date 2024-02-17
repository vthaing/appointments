import { firebase } from '@react-native-firebase/firestore'
import { updateUser, getUserByID } from '../../users'
import { getUnixTimeStamp } from '../../helpers/timeFormat'

const notificationsRef = firebase.firestore().collection('notifications')

const fcmURL = 'https://fcm.googleapis.com/fcm/send'
const firebaseServerKey =
  'AAAA_-2JkDo:APA91bFPHWEtBQfcPnMQbiahs4-5ikZDcbXrK_PuD8bTdKhhNjNhb0rwbpEOkMQx_YOJWIeJLWLB9-1iwm5KaFYo8kxz5ygjJ9DFLL0caG9oigCa-hh5qKsFA-Zyrd-r3v_v8NqAUYy_'

const handleUserBadgeCount = async userID => {
  const user = await getUserByID(userID)
  const newBadgeCount = (user?.badgeCount ?? 0) + 1
  updateUser(userID, { badgeCount: newBadgeCount })
  return newBadgeCount
}

const sendPushNotification = async (
  toUser,
  title,
  body,
  type,
  metadata = {},
) => {
  if (metadata && metadata.outBound && toUser.id == metadata.outBound.id) {
    return
  }
  if (toUser.settings && toUser.settings.push_notifications_enabled == false) {
    return
  }
  // first, we fetch the latest push token of the recipient
  const userData = await getUserByID(toUser.id)
  const recipientData = userData?.data
  if (!recipientData || !recipientData.pushToken) {
    return
  }

  const notification = {
    toUserID: toUser.id,
    title,
    body,
    metadata,
    toUser,
    type,
    seen: false,
  }

  const ref = await notificationsRef.add({
    ...notification,
    createdAt: getUnixTimeStamp(),
  })
  notificationsRef.doc(ref.id).update({ id: ref.id })

  const userBadgeCount = await handleUserBadgeCount(toUser.id || toUser.userID)

  const pushNotification = {
    to: recipientData.pushToken,
    notification: {
      title: title,
      body: body,
      sound: 'default',
      badge: userBadgeCount,
    },
    data: { type, toUserID: toUser.id, ...metadata },
    priority: 'high',
  }

  fetch(fcmURL, {
    method: 'post',
    headers: new Headers({
      Authorization: 'key=' + firebaseServerKey,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  })
  console.log('sent push notifications ' + body + ' to ' + toUser.pushToken)
}

const sendCallNotification = async (sender, recipient, callType, callID) => {
  if (!recipient.id) {
    return
  }

  // first, we fetch the latest push token of the recipient
  const userData = await getUserByID(recipient.id)
  const recipientData = userData?.data
  if (!recipientData || !recipientData.pushToken) {
    return
  }

  const pushNotification = {
    to: recipientData.pushToken,
    priority: 'high',
    data: {
      recipientID: recipient.id,
      senderID: sender.id,
      callType,
      callID,
      callerName: sender.firstName,
      priority: 'high',
      contentAvailable: true,
    },
  }

  try {
    const response = await fetch(fcmURL, {
      method: 'post',
      headers: new Headers({
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(pushNotification),
    })
    console.log('jjj push notif ' + JSON.stringify(pushNotification))
    console.log(JSON.stringify(response))
  } catch (error) {
    console.log(error)
  }
}

export const notificationManager = {
  sendPushNotification,
  sendCallNotification,
}
