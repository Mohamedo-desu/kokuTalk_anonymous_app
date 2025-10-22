import { Ionicons } from '@expo/vector-icons';
import { api } from 'convex/_generated/api';
import { useMutation, usePaginatedQuery } from 'convex/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUnistyles } from 'react-native-unistyles';

interface NotificationItem {
  _id: string;
  type: 'like' | 'comment';
  isRead: boolean;
  createdAt: number;
  sourceUser: {
    username: string;
  };
  confessionId?: string;
  comment?: {
    text: string;
  };
}

const NotificationsScreen = () => {
  const { theme } = useUnistyles();
  const markAllAsRead = useMutation(api.notifications.markAllNotificationsAsRead);

  const {
    results: notifications,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.notifications.getNotifications,
    { paginationOpts: { numItems: 20, cursor: null } },
    { initialNumItems: 20 }
  );

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    if (notification.confessionId) {
      router.push({
        pathname: '/(protected)/confession_details',
        params: { id: notification.confessionId },
      });
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const getNotificationIcon = () => {
      switch (item.type) {
        case 'like':
          return 'heart';
        case 'comment':
          return 'chatbubble-ellipses';
        default:
          return 'notifications';
      }
    };

    const getNotificationText = () => {
      switch (item.type) {
        case 'like':
          return `${item.sourceUser.username} liked your confession`;
        case 'comment':
          return `${item.sourceUser.username} commented on your confession`;
        default:
          return 'New notification';
      }
    };

    return (
      <TouchableOpacity
        style={[styles.notificationContainer, !item.isRead && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={getNotificationIcon()} size={24} color={theme.Colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notificationText}>{getNotificationText()}</Text>
            <Text style={styles.timeText}>
              {formatDistanceToNowStrict(item.createdAt, { addSuffix: true })}
            </Text>
          </View>
        </View>
        {item.comment && (
          <Text style={styles.commentPreview} numberOfLines={2}>
            {item.comment.text}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item._id}
        onEndReached={() => loadMore(20)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={theme.Colors.primary} />
          ) : (
            <Text style={styles.emptyText}>No notifications yet</Text>
          )
        }
        ListFooterComponent={
          status === 'LoadingMore' ? (
            <ActivityIndicator size="small" color={theme.Colors.primary} />
          ) : null
        }
      />
    </KeyboardAwareScrollView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'transparent',
  },
  markAllText: {
    color: 'transparent',
    fontSize: 14,
  },
  notificationContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  unreadNotification: {
    backgroundColor: 'transparent',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: 'transparent',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: 'transparent',
  },
  commentPreview: {
    fontSize: 14,
    color: 'transparent',
    marginTop: 8,
    marginLeft: 52,
  },
  emptyText: {
    textAlign: 'center',
    color: 'transparent',
    marginTop: 32,
  },
});
