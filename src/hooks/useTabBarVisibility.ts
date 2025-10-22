import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useTabBarVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleScroll = useCallback(
    (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;
      const atTop = currentScrollY <= 0;

      if (scrollingDown && isVisible && !atTop) {
        setIsVisible(false);
        Animated.timing(translateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if ((scrollingUp || atTop) && !isVisible) {
        setIsVisible(true);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }

      lastScrollY.current = currentScrollY;
      scrollY.setValue(currentScrollY);
    },
    [isVisible, translateY, scrollY]
  );

  return {
    isVisible,
    translateY,
    handleScroll,
    scrollY,
  };
};
