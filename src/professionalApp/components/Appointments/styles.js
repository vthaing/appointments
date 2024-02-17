import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  return new StyleSheet.create({
    flat: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey3,
      paddingTop: 10,
    },
    emptyViewContainer: {
      paddingTop: '25%',
      flex: 1,
      backgroundColor: theme.colors[appearance].grey3,
    },
  })
}

export default styles
