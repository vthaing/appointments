import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import { useNavigation } from '@react-navigation/native'
import { useTheme, useTranslations } from 'dopenative'
import { appointmentAPIManager } from '../../../api'
import dynamicStyles from './styles'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'

export default function AppointmentItem({ item, isProfessional }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const navigation = useNavigation()

  const [isProfileCardVisible, setIsProfileCardVisible] = useState(false)
  const [profileCard, setProfileCard] = useState(null)

  const isPastAppointment = +new Date() > item.selectedDate
  const isCanceled =
    item?.status === appointmentAPIManager.appointmentStatus.canceled
  const isConfirmed =
    item?.status === appointmentAPIManager.appointmentStatus.confirmed

  const statusStyle = {
    [appointmentAPIManager.appointmentStatus.confirmed]:
      styles.confirmIndicatorContainer,
    [appointmentAPIManager.appointmentStatus.unconfirmed]:
      styles.unconfirmIndicatorContainer,
    [appointmentAPIManager.appointmentStatus.canceled]:
      styles.canceledIndicatorContainer,
    [appointmentAPIManager.appointmentStatus.rescheduled]:
      styles.rescheduledStatusContainer,
  }
  const canNotEdit = isCanceled || isConfirmed || isPastAppointment

  useEffect(() => {
    if (profileCard) {
      setIsProfileCardVisible(true)
      return
    }
    setIsProfileCardVisible(false)
  }, [profileCard])

  const onUserItemPress = async () => {
    const professionalProfileCard = {
      fullname: item.professionalName,
      profilePictureURL: item?.professionalProfilePicture,
      specialty: item?.selectedSkill,
      profileId: item?.professionalId,
      professionalID: item.professionalId,
    }

    const customerProfileCard = {
      fullname: item?.customerName,
      profilePictureURL: item?.customerProfilePicture,
      specialty: item?.selectedSkill,
      profileId: item?.authorID,
      professionalID: item.professionalId,
    }

    setProfileCard(
      isProfessional ? customerProfileCard : professionalProfileCard,
    )
  }

  const onReschedule = async () => {
    navigation?.navigate('BookAppointment', {
      defaultAppointment: item,
    })
  }

  const alertCanNotEdit = () => {
    Alert.alert(
      localized('Cannot edit appointment'),
      localized(
        `You can no longer edit this appointment as it is already ${
          item?.status.toLowerCase() ?? ''
        }`,
      ),
      [
        {
          text: localized('Ok'),
        },
      ],
    )
  }

  const onEditPress = () => {
    if (canNotEdit) {
      return alertCanNotEdit()
    }
    onReschedule(item)
  }

  const onCancel = () => {
    if (isCanceled) {
      return Alert.alert(
        localized('Cancelled'),
        localized('This appointment is already cancelled.'),
        [
          {
            text: localized('OK'),
          },
        ],
      )
    }

    Alert.alert(
      localized('Cancel appointment?'),
      localized('Are you sure you want to cancel this appointment?'),
      [
        {
          text: localized('No, keep'),
        },
        {
          text: localized('Yes, cancel'),
          onPress: () => appointmentAPIManager.cancelAppointment(item.id),
          style: 'destructive',
        },
      ],
    )
  }

  const onDimiss = () => {
    setIsProfileCardVisible(false)
    setProfileCard(null)
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}> {item?.appointmentTime}</Text>
        </View>
        <TouchableOpacity
          onPress={onUserItemPress}
          style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: isProfessional
                  ? item?.customerProfilePicture
                  : item?.professionalProfilePicture,
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.detailContainer}>
          <TouchableOpacity onPress={onUserItemPress}>
            <Text style={styles.professionalName}>
              {isProfessional ? item.customerName : item?.professionalName}
            </Text>
            <Text style={styles.selectedSkill}>
              {item?.selectedSkill} -{' '}
              <Text style={styles.selectedSkill}>{item?.appointmentType}</Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicatorContainer,
                statusStyle[item.status],
              ]}
            />
          </View>
        </View>
      </View>
      {!isPastAppointment && (
        <View style={styles.bottomContainer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={isCanceled}
              style={[styles.buttonContainer, styles.cancelButtonContainer]}>
              <Text style={[styles.buttonTitle, styles.cancelButtonTitle]}>
                {localized('Cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEditPress}
              style={[
                styles.buttonContainer,
                canNotEdit && styles.cancelButtonContainer,
              ]}>
              <Text
                style={[
                  styles.buttonTitle,
                  canNotEdit && styles.cancelButtonTitle,
                ]}>
                {localized('Edit')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
