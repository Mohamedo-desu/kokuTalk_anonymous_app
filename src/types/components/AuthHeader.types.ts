import { Ionicons } from '@expo/vector-icons';

export interface AuthHeaderProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export interface IconProps {
  onPress: () => void;
}
export interface IconWithNameProps {
  onPress: () => void;
  name: keyof typeof Ionicons.glyphMap;
}
