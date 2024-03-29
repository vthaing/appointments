import React, { useState, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import PropTypes from 'prop-types'
import { useTheme } from 'dopenative'
import ThreadItem from './ThreadItem'
import TypingIndicator from './TypingIndicator'
import dynamicStyles from './styles'

function MessageThread(props) {
  const {
    messages,
    user,
    onChatMediaPress,
    onSenderProfilePicturePress,
    onMessageLongPress,
    channelItem,
    onListEndReached,
  } = props
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [isParticipantTyping, setIsParticipantTyping] = useState(false)

  useEffect(() => {
    if (channelItem?.typingUsers) {
      getUsersTyping()
    }
  }, [channelItem])

  const getUsersTyping = () => {
    const userID = user.id || user.userID
    const typingUsers = channelItem.typingUsers?.filter(
      typingUser => typingUser.isTyping && typingUser.userID !== userID,
    )

    if (typingUsers?.length > 0) {
      setIsParticipantTyping(true)
    } else {
      setIsParticipantTyping(false)
    }
  }

  const renderListHeaderComponent = () => {
    return (
      isParticipantTyping && (
        <View style={[styles.receiveItemContainer]}>
          <View style={styles.indicatorContainer}>
            <View style={styles.typingIndicatorContainer}>
              <TypingIndicator
                containerStyle={styles.indicatorDotContainer}
                dotRadius={5}
              />
            </View>
            <View style={styles.typingIndicatorContentSupport} />
            <View style={styles.typingIndicatorSupport} />
          </View>
        </View>
      )
    )
  }

  const renderChatItem = ({ item, index }) => {
    const isRecentItem = 0 === index
    return (
      <ThreadItem
        item={item}
        key={'chatitem' + index}
        user={{ ...user, userID: user.id }}
        onChatMediaPress={onChatMediaPress}
        onSenderProfilePicturePress={onSenderProfilePicturePress}
        onMessageLongPress={onMessageLongPress}
        isRecentItem={isRecentItem}
      />
    )
  }

  return (
    <FlatList
      inverted={true}
      vertical={true}
      style={styles.messageThreadContainer}
      showsVerticalScrollIndicator={false}
      data={messages}
      renderItem={renderChatItem}
      contentContainerStyle={styles.messageContentThreadContainer}
      removeClippedSubviews={true}
      ListHeaderComponent={() => renderListHeaderComponent()}
      keyboardShouldPersistTaps={'never'}
      onEndReached={onListEndReached}
      onEndReachedThreshold={0.3}
    />
  )
}

MessageThread.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  onChatMediaPress: PropTypes.func,
}

export default MessageThread
