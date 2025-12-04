import { useEffect } from 'react';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const useBorderAnimation = (container, duration) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!container.w || !container.h) return;

    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, [container, duration]);

  return progress;
};
