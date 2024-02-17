import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View } from 'react-native'
import Modal from 'react-native-modal'
import { useTheme, useTranslations } from 'dopenative'
import { useSelector } from 'react-redux'
import { appointmentAPIManager } from '../../api'
import Hamburger from '../../../components/Hamburger/Hamburger'
import dynamicStyles from './styles'
import AppointmentItem from '../../../components/AppointmentItem/AppointmentItem'
import Appointments from '../../components/Appointments/Appointments'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'

export default function AllAppointmentsScreen({ navigation }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const currentUser = useSelector(state => state.auth.user)

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false)
  const [profileCard, setProfileCard] = useState(null)

  const emptyStateConfig = {
    title: localized('No Appointments'),
    description: localized(
      'You have no upcoming appointment for the selected day. Upcoming appointments will appear here.',
    ),
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Your Appointments'),
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
    if (profileCard) {
      setIsProfileCardVisible(true)
      return
    }
    setIsProfileCardVisible(false)
  }, [profileCard])

  useEffect(() => {
    const unsubscribeAppointments =
      appointmentAPIManager.subscribeProfessionalAppointments(
        currentUser?.id,
        onAppointmentsUpdate,
      )

    return unsubscribeAppointments
  }, [])

  const onAppointmentsUpdate = data => {
    setAppointments(data)
    setLoading(false)
  }

  const editAppointment = async (item, isReschedule) => {
    const navParams = {
      defaultAppointment: {
        professionalId: item.professionalId,
        vendorId: item.vendorId,
      },
    }

    if (isReschedule) {
      navParams.defaultAppointment = item
    }

    navigation?.navigate('BookAppointment', navParams)
  }

  const onReschedule = async item => {
    editAppointment(item, true)
  }

  const onBookAgain = async item => {
    editAppointment(item)
  }

  const onUserItemPress = async item => {
    const isProfessional = currentUser.id === item.professionalId

    const professionalProfileCard = {
      fullname: item.professionalName,
      profilePictureURL: item?.professionalProfilePicture,
      specialty: item?.selectedSkill,
      profileId: item?.professionalId,
      vendorId: item?.vendorId,
      professionalID: item.professionalId,
    }
    const customerProfileCard = {
      fullname: item?.customerName,
      profilePictureURL: item?.customerProfilePicture,
      specialty: item?.selectedSkill,
      profileId: item?.authorID,
      vendorId: item?.vendorId,
      professionalID: item.professionalId,
    }

    setProfileCard(
      isProfessional ? customerProfileCard : professionalProfileCard,
    )
  }

  const onDimiss = () => {
    setIsProfileCardVisible(false)
    setProfileCard(null)
  }

  const renderItem = ({ item, index }) => {
    const isProfessional = currentUser.id === item.professionalId

    return (
      <AppointmentItem
        key={item?.id ?? index}
        item={item}
        onReschedule={onReschedule}
        onBookAgain={onBookAgain}
        onUserItemPress={onUserItemPress}
        isProfessional={isProfessional}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Appointments
        emptyStateConfig={emptyStateConfig}
        appointments={appointments}
        loading={loading}
        renderItem={renderItem}
      />
      <Modal
        isVisible={isProfileCardVisible}
        onSwipeComplete={onDimiss}
        swipeDirection={['up', 'left', 'right', 'down']}
        onBackdropPress={onDimiss}
        onDismiss={onDimiss}
        style={styles.modalContainer}>
        <ProfileCard {...(profileCard ?? {})} onDismissCard={onDimiss} />
      </Modal>
    </View>
  )
}
