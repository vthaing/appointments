import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen'

const avatarWrapperSize = h(7)

const dynamicStyles = (theme, appearance) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      width: '96%',
      marginBottom: 10,
      padding: 10,
      alignSelf: 'center',
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    topContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 10,
    },
    timeContainer: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    time: {
      fontSize: h(1.9),
      textAlign: 'center',
      color: theme.colors[appearance].primaryForeground,
      fontWeight: '600',
    },
    avatarContainer: {
      flex: 1.1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'blue',
    },
    avatarWrapper: {
      width: avatarWrapperSize,
      height: avatarWrapperSize,
      borderRadius: Math.floor(avatarWrapperSize / 4),
      overflow: 'hidden',
    },
    avatar: {
      height: '100%',
      width: '100%',
    },
    detailContainer: {
      flex: 3,
      justifyContent: 'center',
    },
    professionalName: {
      fontSize: h(2),
      paddingBottom: 8,
      color: theme.colors[appearance].primaryText,
      fontWeight: '600',
    },
    selectedSkill: {
      fontSize: h(1.7),
      color: theme.colors[appearance].secondaryText,
    },
    statusContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      borderRadius: 15,
      overflow: 'hidden',
      // backgroundColor: 'yellow',
    },
    statusIndicatorContainer: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: theme.colors[appearance].grey6,
      overflow: 'hidden',
      marginRight: 8,
    },
    confirmIndicatorContainer: {
      backgroundColor: theme.colors[appearance].primaryForeground,
    },
    unconfirmIndicatorContainer: {
      backgroundColor: theme.colors[appearance].grey6,
    },
    canceledIndicatorContainer: {
      backgroundColor: 'red',
    },
    rescheduledStatusContainer: {
      backgroundColor: 'pink',
    },
    statusTitle: {
      color: theme.colors[appearance].secondaryText,
      fontWeight: '500',
    },
    scheduleItemIcon: {
      height: 20,
      width: 20,
      marginRight: 8,
      tintColor: theme.colors[appearance].grey6,
    },
    bottomContainer: {
      height: h(8),
      width: '100%',
    },
    buttonsContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors[appearance].grey3,
    },
    buttonContainer: {
      height: '70%',
      width: '45%',
      backgroundColor: theme.colors[appearance].primaryForeground,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    cancelButtonContainer: {
      marginRight: 13,
      backgroundColor: theme.colors[appearance].grey3,
    },
    buttonTitle: {
      color: '#fff',
      fontWeight: '500',
    },
    cancelButtonTitle: {
      color: theme.colors[appearance].primaryText,
      fontWeight: '500',
    },
    modalContainer: {
      justifyContent: 'flex-end',
      margin: 0,
    },
  })

export default dynamicStyles
