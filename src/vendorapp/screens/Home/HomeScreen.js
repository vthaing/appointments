import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Alert, FlatList, Image, TouchableOpacity, View } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import PropTypes from 'prop-types'
import { categoriesAPIManager, professionalsAPIManager } from '../../../api'
import { TNEmptyStateView } from '../../../Core/truly-native'
import { useSelector } from 'react-redux'
import dynamicStyles from './styles'
import ProfessionalItem from '../../../components/ProfessionalItem/ProfessionalItem'
import { useSingleVendor } from '../../../Core/vendor/api'
import Hamburger from '../../../components/Hamburger/Hamburger'
import { useConfig } from '../../../config'

function HomeScreen(props) {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()

  const currentUser = useSelector(state => state.auth.user)

  const [professionals, setProfessionals] = useState([])
  const [categories, setCategories] = useState([])

  const [refreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const { vendor } = useSingleVendor(
    config.tables.vendorsTableName,
    currentUser?.vendorID,
  )

  useLayoutEffect(() => {
    const navigationOptions = {
      title: vendor?.title,
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    }

    if (config.isMultiVendorEnabled) {
      navigationOptions.headerRight = renderHeaderRight
    }
    navigation.setOptions(navigationOptions)
  }, [navigation, categories, vendor])

  useEffect(() => {
    if (!vendor?.id) {
      return
    }

    setLoading(true)

    const unsubscribeProfessionals =
      professionalsAPIManager.subscribeVendorProfessionals(
        vendor?.id,
        onProfessionalsUpdate,
      )
    const unsubscribeCategories = categoriesAPIManager.subscribeCategories(
      config.tables?.vendorCategoriesTableName,
      onCategoriesUpdate,
    )

    return () => {
      unsubscribeProfessionals && unsubscribeProfessionals()
      unsubscribeCategories && unsubscribeCategories()
    }
  }, [vendor?.id])

  const onSearchProfessional = () => {
    navigation.navigate('Search')
  }

  const emptyStateConfig = {
    title: localized('No Professionals'),
    description: localized(
      'You have not added any professional, please search and add a professional',
    ),
    buttonName: localized('Search for professionals'),
    onPress: onSearchProfessional,
  }

  const onCategoriesUpdate = newCategories => {
    setCategories(newCategories)
  }

  const onProfessionalsUpdate = data => {
    setProfessionals(data)
    setLoading(false)
  }

  const onPress = item => {}

  const renderHeaderRight = () => {
    return (
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditVendor', {
              selectedItem: vendor,
              categories: categories,
            })
          }}>
          <Image
            style={styles.icon}
            source={require('../../../assets/icons/pen.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Reviews', { entityID: vendor?.id })
          }>
          <Image
            style={styles.icon}
            source={require('../../../assets/icons/review.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const onProfessionalItemPress = item => {
    navigation.navigate('ProfessionalItemDetail', {
      professional: item,
      vendor,
    })
  }

  const onDeleteProfessional = item => {
    professionalsAPIManager.deleteProfessional(item.id)
  }

  const onDelete = item => {
    Alert.alert(
      localized('Remove Professional'),
      localized('Are you sure you want to remove this professional'),
      [
        {
          text: localized('Yes'),
          style: 'destructive',
          onPress: () => onDeleteProfessional(item),
        },
        {
          text: localized('No'),
        },
      ],
    )
  }

  const renderItem = ({ item, index }) => (
    <ProfessionalItem
      key={item?.id ?? index}
      onPress={onProfessionalItemPress}
      item={item}
      onDelete={onDelete}
    />
  )

  return (
    <View style={styles.container}>
      {professionals.length === 0 && !loading && (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )}
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={professionals}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
        numColumns={2}
        initialNumToRender={5}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
}

export default HomeScreen
