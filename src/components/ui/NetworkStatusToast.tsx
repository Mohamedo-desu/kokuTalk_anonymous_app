import { Colors } from '@/constants/Colors';
import useNetworkState from '@/hooks/useNetworkState';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NetworkStatusToast = () => {
  const { isConnected } = useNetworkState();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);

  const showToast = () => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    });
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const hideToast = () => {
    translateY.value = withSpring(-60, {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    });
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  useEffect(() => {
    if (isConnected === false) {
      showToast();
    } else {
      hideToast();
    }
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (isConnected === null) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.content,
          {
            backgroundColor: isConnected === false ? Colors.error : Colors.success,
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={[styles.icon, { backgroundColor: Colors.white }]} />
        <Text style={styles.text}>
          {isConnected === false ? 'No internet connection' : 'Back online'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NetworkStatusToast;
