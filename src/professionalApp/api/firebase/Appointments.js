import { firebase } from '../../../Core/api/firebase/config'

const appointmentsRef = firebase.firestore().collection('appointments_bookings')

const appointmentStatus = {
  confirmed: 'Confirmed',
  unconfirmed: 'Unconfirmed',
  canceled: 'Canceled',
  completed: 'Completed',
}

const subscribeProfessionalAppointments = (professionalId, callback) => {
  if (!professionalId) {
    return null
  }
  return (
    appointmentsRef
      .where('professionalId', '==', professionalId)
      // .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const appointments = snapshot?.docs
          .map(doc => ({
            appointmentDate: 0,
            ...(doc?.data() ?? {}),
            id: doc.id,
          }))
          .sort((a, b) => {
            return a.appointmentDate - b.appointmentDate
          })

        const currentDate = +new Date()

        const upcomingStartIndex = appointments.findIndex(
          dataItem => dataItem?.appointmentDate > currentDate,
        )
        const upcomingAppointments = appointments.splice(upcomingStartIndex)

        return callback && callback([...upcomingAppointments, ...appointments])
      })
  )
}

const subscribeProfessionalDateAppointments = (
  professionalId,
  formattedDate,
  callback,
) => {
  if (!professionalId || !formattedDate) {
    return null
  }
  return (
    appointmentsRef
      .where('professionalId', '==', professionalId)
      .where('formattedDate', '==', formattedDate)
      // .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const appointments = snapshot?.docs
          .map(doc => ({
            appointmentDate: 0,
            ...(doc?.data() ?? {}),
            id: doc.id,
          }))
          .sort((a, b) => {
            return a.appointmentDate - b.appointmentDate
          })

        const currentDate = +new Date()

        const upcomingStartIndex = appointments.findIndex(
          dataItem => dataItem?.appointmentDate > currentDate,
        )
        const upcomingAppointments = appointments.splice(upcomingStartIndex)

        return callback && callback([...upcomingAppointments, ...appointments])
      })
  )
}

export default {
  subscribeProfessionalAppointments,
  subscribeProfessionalDateAppointments,
  appointmentStatus,
}
