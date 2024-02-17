import React, { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { Text, Image, View, TouchableOpacity } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { professionalsAPIManager } from '../../api'
import { useSingleVendor } from '../../Core/vendor/api'
import { useSelector } from 'react-redux'
import dynamicStyles from './styles'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import { TNActivityIndicator } from '../../Core/truly-native'
import { useConfig } from '../../config'

export default function ProfessionalItemDetailScreen({ route, navigation }) {
  const profileId = route?.params?.profileId
  const vendorId = route?.params?.vendorId

  const insets = useSafeAreaInsets()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const currentUser = useSelector(state => state.auth.user)
  const config = useConfig()

  const [loading, setLoading] = useState(false)

  const [professional, setProfessional] = useState(
    route?.params?.professional ?? {},
  )

  const { vendor } = useSingleVendor(
    config.tables.vendorsTableName,
    vendorId || route?.params?.vendor?.id,
  )

  const fullname = `${professional?.firstName ?? ''} ${
    professional?.lastName ?? ''
  }`

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Professional Profile'),
      headerRight: renderHeaderRight,
    })
  }, [navigation])

  useEffect(() => {
    if (vendorId || profileId) {
      hydrateVendorAndProfessional()
    }
  }, [vendorId, profileId])

  const hydrateVendorAndProfessional = async () => {
    setLoading(true)
    const appointmentProfessional =
      await professionalsAPIManager.getProfessional(profileId)

    if (profileId) {
      setProfessional(appointmentProfessional)
    }

    setLoading(false)
  }

  const onBookAppointment = () => {
    navigation.navigate('BookAppointment', {
      professional,
      vendor,
    })
  }

  const onReviewPress = () => {
    navigation.navigate('Reviews', { entityID: professional.id })
  }

  const renderHeaderRight = () => {
    return (
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onReviewPress}>
          <Image
            style={styles.navIcon}
            source={require('../../assets/icons/review.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ProfileCard
        fullname={fullname}
        profilePictureURL={professional?.profilePictureURL}
        specialty={professional?.professionalSpecialty}
        isBottomSheet={false}
        profileId={professional?.id}
        canContact={!currentUser?.vendorID}
      />
      <View style={styles.bodyContainer}>
        <View style={styles.bioContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{localized('Information')}</Text>
          </View>
          <View style={styles.bioDetailContainer}>
            <Text style={styles.skillsDetail}>{professional?.bio}</Text>
          </View>
        </View>
        <View style={styles.skillsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{localized('Specialities')}</Text>
          </View>
          <View style={styles.skillsDetailContainer}>
            {(professional?.professionalSkills ?? []).map(skill => (
              <Text style={styles.skillsDetail}>{skill?.displayName}</Text>
            ))}
          </View>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{localized('Location')}</Text>
          </View>
          <View style={styles.vendorLocationContainer}>
            <View style={styles.locationIconContainer}>
              <View style={styles.locationIconWrapper}>
                <Image
                  style={styles.locationIcon}
                  source={theme.icons.mapMarker}
                />
              </View>
            </View>
            <View style={styles.locationDetailContainer}>
              <Text style={styles.locationName}>{vendor?.title}</Text>
              <Text style={styles.locationAddress}>{vendor?.place}</Text>
            </View>
          </View>
        </View>
      </View>
      {!currentUser?.vendorID && (
        <View
          style={[
            styles.footerContainer,
            { paddingBottom: Math.floor(insets.bottom, 16) },
          ]}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceTitle}>
              {localized('Consultation price')}
            </Text>
            <Text style={styles.price}>
              {professional?.pricePerHr ?? localized('$52/hr')}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onBookAppointment} style={styles.button}>
              <Text style={styles.buttonTitle}>
                {localized('Book Appointment')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {loading && <TNActivityIndicator />}
    </View>
  )
}
