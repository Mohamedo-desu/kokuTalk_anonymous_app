import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { DEVICE_WIDTH } from '@/utils';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Share, Text, TouchableOpacity, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import RenderHTML from 'react-native-render-html';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

const PostCard: FC<any> = ({ item, index, router, isDetails = false, canDelete = false }) => {
  const isVideo = item.fileType === 'video';
  const isImage = item.fileType === 'image';
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(item.post_likes);
  }, [item.post_likes]);

  const player = isVideo
    ? useVideoPlayer(item.fileUrl, (playerInstance: any) => {
        playerInstance.loop = false;
        playerInstance.generateThumbnailsAsync(0);
      })
    : null;

  // Mutations
  const toggleLike = useMutation(api.confessions.toggleLike);
  const deletePost = useMutation(api.confessions.deletePost);

  const handleToggleLike = async (): Promise<void> => {
    try {
      await toggleLike({ confessionId: item._id as Id<'confessions'> });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  const handleShare = async () => {
    try {
      setLoading(true);
      const message = item.body ? stripHtmlTags(item.body) : 'Check out this post!';
      const result = await Share.share({
        message: message.substring(0, 120) + '...',
        url: item.file,
      });

      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to share post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      if (!canDelete) return;
      Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePost({ postId: item.id as Id<'confessions'> });
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  const handleOpenPostDetails = () => {
    if (isDetails) return;
    router.push({
      pathname: '/post_details',
      params: { postId: item.id },
    });
  };

  const { theme } = useUnistyles();

  // Memoize tag styles based on theme
  const htmlTagStyles = useMemo(
    () => ({
      div: {
        color: theme.Colors.typography,
        fontSize: 12,
      },
      p: {
        color: theme.Colors.typography,
        fontSize: 12,
      },
      ol: {
        color: theme.Colors.typography,
        fontSize: 12,
      },
      h1: {
        color: theme.Colors.typography,
      },
      h4: {
        color: theme.Colors.typography,
      },
    }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.confessor.image_url }}
            contentFit="cover"
            style={styles.photoContainer}
          />

          <View style={{ gap: 2 }}>
            <Text style={styles.displayName}>{item.confessor.username}</Text>
            <Text style={styles.postTime}>
              {formatDistanceToNowStrict(item._creationTime, { addSuffix: true })}
            </Text>
          </View>
        </View>
        {!isDetails && (
          <TouchableOpacity onPress={handleOpenPostDetails}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color={Colors.lightGray[400]}
            />
          </TouchableOpacity>
        )}
        {canDelete && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => {}}>
              <Feather name="edit-2" size={20} color={Colors.lightGray[400]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePost}>
              <Feather name="trash-2" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item.text && item.text?.length > 0 && (
            <RenderHTML
              contentWidth={DEVICE_WIDTH}
              source={{ html: item.text }}
              tagsStyles={htmlTagStyles}
              defaultTextProps={{
                numberOfLines: !isDetails ? 3 : undefined,
                ellipsizeMode: 'tail',
              }}
            />
          )}
        </View>
        {isImage && (
          <Image
            source={{ uri: item.fileUrl }}
            contentFit="cover"
            transition={100}
            style={styles.postMedia}
          />
        )}
        {isVideo && player && (
          <VideoView
            style={styles.videoPlayer}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={handleToggleLike} hitSlop={10}>
            <MaterialCommunityIcons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={item.isLiked ? Colors.primary : theme.Colors.gray[500]}
            />
          </TouchableOpacity>
          <AnimatedNumbers
            includeComma
            animationDuration={300}
            animateToNumber={item.likesCount}
            fontStyle={styles.count}
          />
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={handleOpenPostDetails} hitSlop={10}>
            <MaterialCommunityIcons
              name="comment-outline"
              size={24}
              color={theme.Colors.gray[500]}
            />
          </TouchableOpacity>
          <AnimatedNumbers
            includeComma
            animationDuration={300}
            animateToNumber={item.commentsCount}
            fontStyle={styles.count}
          />
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={handleShare} hitSlop={10}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Feather name="share" size={22} color={theme.Colors.gray[500]} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create(theme => ({
  container: {
    gap: 10,
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 10,
    backgroundColor: theme.Colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  content: {},
  postBody: { marginBottom: 10 },
  postMedia: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  videoPlayer: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  displayName: {
    fontSize: 13,
    fontFamily: Fonts.Medium,
  },
  userName: {
    fontSize: 12,
    color: theme.Colors.gray[400],
  },
  postTime: {
    fontSize: 10,
    color: theme.Colors.gray[400],
    fontFamily: Fonts.Regular,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  closeIcon: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 5,
    borderRadius: 100,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  count: {
    fontSize: 14,
    color: theme.Colors.typography,
    fontFamily: Fonts.Regular,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageBackground: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalNameText: {
    fontSize: 22,
    fontFamily: Fonts.Medium,
    textTransform: 'capitalize',
    color: Colors.white,
  },
  modalIconContainer: {},
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
}));
