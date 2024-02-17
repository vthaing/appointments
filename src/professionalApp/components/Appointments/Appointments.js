import React from 'react'
import { FlatList, View } from 'react-native'
import { useTheme } from 'dopenative'
import { TNEmptyStateView } from '../../../Core/truly-native'
import dynamicStyles from './styles'

const Appointments = ({
  appointments,
  loading,
  emptyStateConfig,
  renderItem,
}) => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const renderEmptyComponent = () => {
    if (!loading) {
      return (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )
    }
    return null
  }

  return (
    <FlatList
      style={styles.flat}
      data={appointments}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
      ListEmptyComponent={renderEmptyComponent}
    />
  )
}

export default Appointments
