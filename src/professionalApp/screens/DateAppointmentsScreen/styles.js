import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen'

const dynamicStyles = (theme, appearance) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey3,
    },
    calendarContainer: {
      paddingVertical: 20,
      width: '100%',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    calendar: {
      height: h(10),
    },
    calendarTitle: {
      color: theme.colors[appearance].secondaryText,
    },
    highlightDateContainer: {
      backgroundColor: theme.colors[appearance].primaryForeground,
      borderRadius: 8,
    },
    highlightDate: {
      color: '#fff',
    },
  })

export default dynamicStyles
