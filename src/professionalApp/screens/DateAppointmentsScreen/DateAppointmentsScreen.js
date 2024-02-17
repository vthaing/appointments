import React, { useLayoutEffect, useState, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import CalendarStrip from 'react-native-calendar-strip'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { appointmentAPIManager } from '../../api'
import Hamburger from '../../../components/Hamburger/Hamburger'
import dynamicStyles from './styles'
import Appointments from '../../components/Appointments/Appointments'
import AppointmentItem from '../../components/AppointmentItem/AppointmentItem'

export default function DateAppointmentsScreen({ navigation }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const currentUser = useSelector(state => state.auth.user)

  const [selectedDate, setSelectedDate] = useState(
    moment().format('DD/MM/YYYY'),
  )
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const unsubscribeAppointments = useRef(null)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Home'),
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  }, [])

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    unsubscribePreviousAppointments()
    unsubscribeAppointments.current =
      appointmentAPIManager.subscribeProfessionalDateAppointments(
        currentUser?.id,
        selectedDate,
        onAppointmentsUpdate,
      )

    return unsubscribePreviousAppointments
  }, [selectedDate])

  const emptyStateConfig = {
    title: localized('No Appointments'),
    description: localized(
      'You have no upcoming appointment for the selected day. Upcoming appointments will appear here.',
    ),
  }

  const unsubscribePreviousAppointments = () => {
    unsubscribeAppointments.current && unsubscribeAppointments.current()
  }

  const onAppointmentsUpdate = data => {
    setAppointments(data)
    setLoading(false)
  }

  const onDateChange = date => {
    const formattedDate = date?.format('DD/MM/YYYY')

    setSelectedDate(formattedDate)
  }

  const renderItem = ({ item, index }) => {
    const isProfessional = currentUser.id === item.professionalId
    return (
      <AppointmentItem
        key={item?.id ?? index}
        item={item}
        isProfessional={isProfessional}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarStrip
          scrollable
          style={styles.calendar}
          // calendarColor={'#3343CE'}
          calendarHeaderStyle={styles.calendarTitle}
          highlightDateNumberStyle={styles.highlightDate}
          highlightDateNameStyle={styles.highlightDate}
          highlightDateContainerStyle={styles.highlightDateContainer}
          dateNumberStyle={styles.calendarTitle}
          dateNameStyle={styles.calendarTitle}
          iconContainer={{ flex: 0.1 }}
          onDateSelected={onDateChange}
          selectedDate={moment()}
        />
      </View>
      <Appointments
        emptyStateConfig={emptyStateConfig}
        appointments={appointments}
        loading={loading}
        renderItem={renderItem}
      />
    </View>
  )
}
