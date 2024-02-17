import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      marginBottom: 12,
      marginTop: 16,
    },
    title: {
      marginLeft: 5,
      fontWeight: 'bold',
      color: theme.colors[appearance].primaryText,
      fontSize: 20,
      marginBottom: 15,
    },
    categoryItemContainer: {
      margin: 10,
      alignItems: 'center',
      maxWidth: 120,
    },
    categoryItemPhoto: {
      height: 70,
      width: 70,
      borderRadius: 35,
    },
    categoryItemTitle: {
      marginTop: 5,
      color: theme.colors[appearance].primaryText,
      textAlign: 'center',
    },
  })
}

export default styles
