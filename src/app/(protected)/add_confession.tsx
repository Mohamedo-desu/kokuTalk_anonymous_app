import Button from '@/components/common/Button';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { getMimeType } from '@/utils/mimeType';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { StyleSheet } from 'react-native-unistyles';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface RichTextEditorRef {
  setContentHTML: (html: string) => void;
}

type MediaFile = ImagePicker.ImagePickerAsset | null;

interface Post {
  id: Id<'confessions'>;
  file: string;
  body: string;
  type: 'public' | 'private';
}

const AddConfessionScreen: React.FC = () => {
  const { postItem } = useLocalSearchParams<{ postItem?: string }>();
  const router = useRouter();
  const { userId } = useAuth();

  // State management
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<MediaFile>(null);
  const [postType, setPostType] = useState<'public' | 'private'>('public');
  const bodyRef = useRef<string>('');
  const editorRef = useRef<RichEditor>(null as unknown as RichEditor);

  // Convex mutations
  const createConfession = useMutation(api.confessions.createConfession);
  const updateConfession = useMutation(api.confessions.updateConfession);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  // Video player setup
  const videoUri: string = file && file.type === 'video' ? file.uri : '';
  const player = useVideoPlayer(videoUri, playerInstance => {
    if (videoUri) {
      playerInstance.loop = true;
    }
  });

  // Media picker function
  const onPick = useCallback(async (isImage: boolean): Promise<void> => {
    try {
      const mediaConfig: ImagePicker.ImagePickerOptions = {
        mediaTypes: isImage ? 'images' : 'videos',
        allowsEditing: true,
        quality: 0.7,
        ...(isImage && { aspect: [4, 3] }),
      };

      const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (error: any) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  }, []);

  // Submit confession
  const onSubmit = useCallback(async (): Promise<void> => {
    if (!bodyRef.current && !file) {
      Alert.alert('Error', 'Please add either text or media to your confession');
      return;
    }

    setLoading(true);
    try {
      let storageId: Id<'_storage'> | undefined;

      if (file) {
        // Upload file if present
        const uploadUrl = await generateUploadUrl();
        const uploadResult = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': getMimeType(file.uri),
          },
          body: await fetch(file.uri).then(r => r.blob()),
        });

        if (uploadResult.status !== 200) {
          const errorText = await uploadResult.text();
          throw new Error('Failed to upload file: ' + errorText);
        }

        // Parse the JSON response.
        const { storageId: storageIdFromResponse } = await uploadResult.json();
        storageId = storageIdFromResponse;
      }

      if (post) {
        // Update existing confession
        await updateConfession({
          confessionId: post.id,
          text: bodyRef.current || undefined,
          visibility: postType,
          storageId,
          fileType: file?.type === 'video' ? 'video' : 'image',
        });
      } else {
        // Create new confession
        await createConfession({
          text: bodyRef.current || undefined,
          visibility: postType,
          storageId,
          fileType: file?.type === 'video' ? 'video' : 'image',
        });
      }

      bodyRef.current = '';
      setFile(null);
      editorRef.current?.setContentHTML('');
      //router.back();
    } catch (error: any) {
      console.error('Error submitting confession:', error);
      Alert.alert('Error', 'Failed to create confession');
    } finally {
      setLoading(false);
    }
  }, [file, postType, createConfession, updateConfession, generateUploadUrl, router, post]);

  useEffect(() => {
    if (postItem) {
      try {
        const parsedPost = JSON.parse(postItem) as Post;
        setPost(parsedPost);
      } catch (error) {
        console.error('Error parsing postItem:', error);
      }
    }
  }, [postItem]);

  useEffect(() => {
    if (post) {
      if (post.file) {
        const fileType: 'video' | 'image' = post.file.includes('videos') ? 'video' : 'image';
        setFile({
          uri: post.file,
          type: fileType,
          fileName: post.file.split('/').pop() ?? 'unknown_file',
          width: 0,
          height: 0,
        } as ImagePicker.ImagePickerAsset);
      }
      bodyRef.current = post.body;
      setPostType(post.type);

      // Delay setting content to allow the editor to mount.
      const timeoutId = setTimeout(() => {
        editorRef.current?.setContentHTML(post.body);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [post]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.textEditor}>
        <RichTextEditor
          editorRef={editorRef}
          onChange={(body: string) => {
            bodyRef.current = body;
          }}
        />
      </View>

      {file?.uri && (
        <View style={styles.file}>
          {file.type === 'video' ? (
            <VideoView
              style={styles.mediaPreview}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
            <Image source={{ uri: file.uri }} contentFit="cover" style={styles.mediaPreview} />
          )}
          <Pressable style={styles.closeIcon} hitSlop={10} onPress={() => setFile(null)}>
            <Text>✕</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.mediaContainer}>
        <View style={styles.mediaIcons}>
          <TouchableOpacity onPress={() => onPick(true)} style={styles.mediaButton}>
            <Text>Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPick(false)} style={styles.mediaButton}>
            <Text>Add Video</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postTypeContainer}>
        <Text style={styles.postTypeTitle}>Visibility</Text>
        <View style={styles.postTypeButtons}>
          <TouchableOpacity
            onPress={() => setPostType('public')}
            style={[styles.postTypeButton, postType === 'public' && styles.selectedPostTypeButton]}
          >
            <Text
              style={[styles.postTypeText, postType === 'public' && styles.selectedPostTypeText]}
            >
              Public
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPostType('private')}
            style={[styles.postTypeButton, postType === 'private' && styles.selectedPostTypeButton]}
          >
            <Text
              style={[styles.postTypeText, postType === 'private' && styles.selectedPostTypeText]}
            >
              Private
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        label={post ? 'Update Confession' : 'Create Confession'}
        onPress={onSubmit}
        isSubmitting={loading}
      />
    </ScrollView>
  );
};

export default AddConfessionScreen;

const styles = StyleSheet.create((theme, rt) => ({
  page: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  scrollContainer: {
    paddingBottom: rt.insets.bottom + 10,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  textEditor: {
    marginBottom: 15,
  },
  file: {
    position: 'relative',
    marginBottom: 15,
  },
  mediaPreview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    marginBottom: 15,
  },
  mediaIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  mediaButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  postTypeContainer: {
    marginBottom: 15,
  },
  postTypeTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  postTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  postTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedPostTypeButton: {
    backgroundColor: '#007AFF',
  },
  postTypeText: {
    color: '#000',
  },
  selectedPostTypeText: {
    color: '#fff',
  },
}));
