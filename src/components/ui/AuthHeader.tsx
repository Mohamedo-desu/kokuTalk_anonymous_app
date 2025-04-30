import { styles } from '@/styles/components/AuthHeader.styles';
import { AuthHeaderProps, IconProps } from '@/types/components/AuthHeader.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Icon: FC<IconProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.iconBtn} hitSlop={10}>
    <Ionicons name="arrow-back" size={24} style={styles.icon} />
  </TouchableOpacity>
);

const AuthHeader: FC<AuthHeaderProps> = ({ title, description, showBackButton = true }) => {
  const router = useRouter();

  return (
    <View>
      {showBackButton && <Icon onPress={() => router.back()} />}
      {title && (
        <Text style={styles.title} adjustsFontSizeToFit>
          {title}
        </Text>
      )}
      {description && (
        <Text style={styles.description} adjustsFontSizeToFit>
          {description}
        </Text>
      )}
    </View>
  );
};

export default AuthHeader;
