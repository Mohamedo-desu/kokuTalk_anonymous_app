import { Comment } from '@/types/schema';
import { Ionicons } from '@expo/vector-icons';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const ConfessionDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: Id<'confessions'> }>();
  const { theme } = useUnistyles();
  const [commentText, setCommentText] = useState('');

  const confession = useQuery(api.confessions.getConfessionById, {
    id: id as Id<'confessions'>,
  });

  const {
    results: comments,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(api.comments.getComments, { confessionId: id }, { initialNumItems: 10 });

  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const deleteConfession = useMutation(api.confessions.deleteConfession);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({
        confessionId: id as any,
        text: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ commentId: commentId as any });
    } catch (error) {
      Alert.alert('Error', 'Failed to delete comment');
    }
  };

  const handleDeleteConfession = async () => {
    Alert.alert('Delete Confession', 'Are you sure you want to delete this confession?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteConfession({ confessionId: id as any });
            router.back();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete confession');
          }
        },
      },
    ]);
  };

  if (!confession) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </View>
    );
  }

  const renderComment = ({
    item,
  }: {
    item: Comment & { user: { username: string; image_url: string } };
  }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.image_url }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{item.user.username}</Text>
          <Text style={styles.commentTime}>
            {formatDistanceToNowStrict(item.createdAt, { addSuffix: true })}
          </Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
      {(confession.user._id === item.userId || confession.userId === item.userId) && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteComment(item._id)}>
          <Ionicons name="trash-outline" size={20} color={theme.Colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.confessionContainer}>
        <View style={styles.confessionHeader}>
          <Image source={{ uri: confession.user.image_url }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{confession.user.username}</Text>
            <Text style={styles.time}>
              {formatDistanceToNowStrict(confession._creationTime, { addSuffix: true })}
            </Text>
          </View>
          {confession.userId === confession.user._id && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteConfession}>
              <Ionicons name="trash-outline" size={24} color={theme.Colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.confessionText}>{confession.text}</Text>
        {confession.fileUrl && (
          <Image source={{ uri: confession.fileUrl }} style={styles.media} resizeMode="cover" />
        )}
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item._id}
        onEndReached={() => loadMore(10)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="small" color={theme.Colors.primary} />
          ) : (
            <Text style={styles.emptyText}>No comments yet</Text>
          )
        }
        ListFooterComponent={
          status === 'LoadingMore' ? (
            <ActivityIndicator size="small" color={theme.Colors.primary} />
          ) : null
        }
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleAddComment}
          disabled={!commentText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={commentText.trim() ? theme.Colors.primary : theme.Colors.gray[400]}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ConfessionDetailsScreen;

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  confessionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.Colors.gray[200],
  },
  confessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.Colors.typography,
  },
  time: {
    fontSize: 12,
    color: theme.Colors.gray[500],
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  confessionText: {
    fontSize: 16,
    color: theme.Colors.typography,
    marginBottom: 12,
  },
  media: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.Colors.gray[200],
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.Colors.typography,
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: theme.Colors.gray[500],
  },
  commentText: {
    fontSize: 14,
    color: theme.Colors.typography,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.Colors.gray[500],
    marginTop: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.Colors.gray[200],
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.Colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
}));
