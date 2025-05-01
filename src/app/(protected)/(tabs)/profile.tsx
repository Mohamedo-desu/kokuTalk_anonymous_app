import { styles } from '@/styles/protected/ProfileScreen.styles';
import { useAuth } from '@clerk/clerk-expo';
import { useAction, useQuery } from 'convex/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../../../convex/_generated/api';

const ProfileScreen = () => {
  const { signOut, userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: userId as string,
  });

  const deleteAccountAction = useAction(api.users.initiateAccountDeletion);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogOut = async () => {
    try {
      Alert.alert('Log out', 'Are you sure you want to log out?', [
        {
          text: 'log out',
          style: 'cancel',
          onPress: async () => {
            try {
              await signOut();
            } catch (err) {
              console.error('error logging out', err);
              Alert.alert('Error', 'Could not log out');
            }
          },
        },
        {
          text: 'Cancel',
          style: 'destructive',
          isPreferred: true,
        },
      ]);
    } catch (error) {
      console.log('Logout error', error);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);

              const result = await deleteAccountAction();

              if (result.success) {
                try {
                  await signOut();
                } catch (signOutError) {
                  console.error('Error signing out:', signOutError);
                }

                router.replace('/(public)');

                setTimeout(() => {
                  Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                }, 500);
              } else {
                throw new Error('Deletion failed');
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              setIsDeleting(false);

              let errorMsg = 'Failed to delete account.';
              if (error instanceof Error) {
                errorMsg += ' ' + error.message;
              }

              Alert.alert('Error', errorMsg);
            }
          },
        },
      ]
    );
  };

  const navigateToPrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image source={{ uri: currentUser?.image_url }} resizeMode="cover" style={styles.image} />
        <Text style={styles.title}>{currentUser?.username}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={navigateToPrivacyPolicy}>
          <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.height}>
        <TouchableOpacity style={styles.btn(true)} activeOpacity={0.8} onPress={handleLogOut}>
          <Text style={styles.btnText(true)}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn(false)}
          activeOpacity={0.8}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <View style={{ height: 20, justifyContent: 'center' }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <Text style={styles.btnText(false)}>Delete account</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
