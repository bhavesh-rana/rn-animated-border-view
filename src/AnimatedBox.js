import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const AnimatedBox = memo(({ index, total, progress, getPosition, color, segmentWidth, segmentHeight, boxExtra }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const t = (progress.value + index / total) % 1;
    const { x, y, rotation } = getPosition(t);
    return {
      transform: [
        { translateX: x - boxExtra / 2 },
        { translateY: y - boxExtra / 2 },
        { rotateZ: `${rotation}deg` },
      ],
      width: segmentWidth + boxExtra,
      height: segmentHeight + boxExtra,
    };
  });

  return <Animated.View style={[styles.box, animatedStyle, { backgroundColor: color }]} />;
});

export default AnimatedBox;

const styles = StyleSheet.create({
  box: { position: 'absolute', borderRadius: 2 },
});
