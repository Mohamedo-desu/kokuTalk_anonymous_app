import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import useNetworkState from '@/hooks/useNetworkState';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

const TOAST_HEIGHT = 60;

const NetworkStatusToast = () => {
  const { isConnected } = useNetworkState();
  const translateY = useSharedValue(-TOAST_HEIGHT);
  const opacity = useSharedValue(0);

  const showToast = () => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 100, mass: 0.5 });
    opacity.value = withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  };

  const hideToast = () => {
    translateY.value = withSpring(-TOAST_HEIGHT, { damping: 15, stiffness: 100, mass: 0.5 });
    opacity.value = withTiming(0, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
  };

  useEffect(() => {
    if (isConnected === false) {
      showToast();
    } else if (isConnected === true) {
      showToast();
      const timer = setTimeout(hideToast, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  if (isConnected === null) return null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { backgroundColor: isConnected ? Colors.success : Colors.error },
      ]}
    >
      <View style={styles.messageContainer}>
        <MaterialCommunityIcons
          name={isConnected ? 'wifi' : 'wifi-off'}
          size={16}
          color={Colors.white}
        />
        <Text style={styles.text}>{isConnected ? 'Back online' : 'No internet connection'}</Text>
      </View>

      <TouchableOpacity onPress={hideToast} style={styles.closeButton} hitSlop={10}>
        <Ionicons name="close" size={16} color={Colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NetworkStatusToast;

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: rt.insets.top,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: 'pink',
  },
  text: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.Medium,
  },
  closeButton: {
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
