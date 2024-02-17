import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen'

const dynamicStyles = (theme, appearance) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    iconContainer: {
      paddingHorizontal: 15,
    },
    navIcon: {
      height: 25,
      width: 25,
      tintColor: theme.colors[appearance].primaryForeground,
    },
    bodyContainer: {
      flex: 1,
    },
    bioContainer: {
      height: '20%',
      width: '100%',
    },
    bioDetailContainer: {
      width: '100%',
      paddingLeft: 20,
      marginVertical: 5,
    },
    titleContainer: {
      width: '100%',
      marginTop: 20,
      marginBottom: 10,
      paddingLeft: 20,
    },
    title: {
      color: theme.colors[appearance].primaryText,
      fontWeight: '600',
      fontSize: 16,
    },
    skillsContainer: {
      height: '15%',
      width: '100%',
    },
    skillsDetailContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      paddingLeft: 20,
      marginVertical: 5,
    },
    skillsDetail: {
      color: theme.colors[appearance].secondaryText,
      marginRight: 10,
    },
    locationContainer: {
      height: '17%',
      width: '100%',
      marginTop: 20,
    },
    vendorLocationContainer: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
    },
    locationIconContainer: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationIconWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 55,
      width: 55,
      borderRadius: 45,
      overflow: 'hidden',
      backgroundColor: theme.colors[appearance].grey3,
    },
    locationIcon: {
      height: '40%',
      width: '40%',
    },
    locationDetailContainer: {
      flex: 2.2,
      justifyContent: 'center',
    },
    locationName: {
      color: theme.colors[appearance].primaryText,
      paddingBottom: 5,
      fontWeight: '400',
    },
    locationAddress: {
      color: theme.colors[appearance].secondaryText,
    },
    footerContainer: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
    priceContainer: {
      flexDirection: 'row',
      height: h(6),
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    priceTitle: {
      color: theme.colors[appearance].secondaryText,
      fontWeight: '400',
      fontSize: h(1.8),
    },
    price: {
      color: theme.colors[appearance].primaryText,
      fontWeight: '600',
      fontSize: h(1.8),
    },
    buttonContainer: {
      height: h(6),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      height: '90%',
      width: '95%',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors[appearance].primaryForeground,
    },
    buttonTitle: {
      color: '#fff',
      fontWeight: '600',
      fontSize: h(1.8),
    },
  })

export default dynamicStyles
