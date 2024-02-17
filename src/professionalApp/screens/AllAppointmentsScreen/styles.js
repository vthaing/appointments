import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey3,
    },
    modalContainer: {
      justifyContent: 'flex-end',
      margin: 0,
    },
  })

export default dynamicStyles
