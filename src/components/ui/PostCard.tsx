import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Confession } from '@/types/schema';
import { DEVICE_WIDTH } from '@/utils';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEvent } from 'expo';
import { Image, useImage } from 'expo-image';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { FC, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Share, Text, TouchableOpacity, View } from 'react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import RenderHTML from 'react-native-render-html';
import { StyleSheet } from 'react-native-unistyles';

interface PostCardProps {
  item: Confession & {
    confessor: {
      username: string;
      image_url: string;
    };
    isLiked?: boolean;
  };
  themeColors: any;
  index: number;
  isDetails?: boolean;
}

const PostCard: FC<PostCardProps> = ({ item, themeColors, index, isDetails = false }) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isVideo = item.fileType === 'video';
  const isImage = item.fileType === 'image';

  const imageUrl = useImage(isImage && item.fileUrl ? item.fileUrl : { uri: undefined });

  const player = useVideoPlayer(isVideo && item.fileUrl ? item.fileUrl : null, playerInstance => {
    playerInstance.loop = false;
    playerInstance.generateThumbnailsAsync(0);
  });

  let status = undefined;
  if (player) {
    ({ status } = useEvent(player, 'statusChange', { status: player.status }));
  }
  const videoLoading = status !== 'readyToPlay';

  // Mutations
  const toggleLike = useMutation(api.confessions.toggleLike);
  const deletePost = useMutation(api.confessions.deletePost);

  const canDelete = item.confessor.username === item.userId;

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
      const message = item.text ? stripHtmlTags(item.text) : 'Check out this post!';
      const result = await Share.share({
        message: message.substring(0, 120) + '...',
        url: item.fileUrl,
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
      if (!canDelete || deleting) return;

      Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            await deletePost({ postId: item._id as Id<'confessions'> });
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenPostDetails = () => {
    if (isDetails) return;
    router.push({
      pathname: '/(protected)/(tabs)/confession/[id]',
      params: { id: item._id },
    });
  };

  const handleEditPost = () => {
    router.push({
      pathname: '/(protected)/(tabs)/add_confession',
      params: { postItem: JSON.stringify(item) },
    });
  };

  const htmlTagStyles = useMemo(
    () => ({
      div: {
        color: themeColors.typography,
        fontSize: 14,
      },
      p: {
        color: themeColors.typography,
        fontSize: 14,
      },
      ol: {
        color: themeColors.typography,
        fontSize: 14,
      },
      h1: {
        color: themeColors.typography,
      },
      h4: {
        color: themeColors.typography,
      },
    }),
    [themeColors]
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

        {canDelete && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEditPost}>
              <Feather name="edit-2" size={20} color={themeColors.gray[400]} />
            </TouchableOpacity>
            {deleting ? (
              <ActivityIndicator size="small" color={themeColors.error} />
            ) : (
              <TouchableOpacity onPress={handleDeletePost}>
                <Feather name="trash-2" size={20} color={themeColors.error} />
              </TouchableOpacity>
            )}
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
        {isImage &&
          (imageUrl ? (
            <Image
              source={{ uri: item.fileUrl }}
              contentFit="cover"
              transition={100}
              style={styles.postMedia}
            />
          ) : (
            <View style={styles.postMedia}>
              <MaterialIcons name="perm-media" size={50} color={themeColors.gray[400]} />
            </View>
          ))}
        {isVideo &&
          player &&
          (videoLoading ? (
            <View style={styles.videoPlayer}>
              <MaterialIcons name="video-collection" size={50} color={themeColors.gray[400]} />
            </View>
          ) : (
            <VideoView
              style={styles.videoPlayer}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ))}
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={handleToggleLike} hitSlop={10}>
            <MaterialCommunityIcons
              name={item.isLiked ? 'thumb-up' : 'thumb-up-outline'}
              size={20}
              color={item.isLiked ? Colors.primary : themeColors.gray[400]}
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
              name="comment-text-multiple-outline"
              size={20}
              color={themeColors.gray[400]}
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
              <MaterialCommunityIcons name="share" size={20} color={themeColors.gray[400]} />
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
    borderRadius: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    height: 300,
    width: '100%',
    borderRadius: 8,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 13,
    fontFamily: Fonts.Medium,
    color: theme.Colors.typography,
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
    fontSize: 16,
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
