import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import AnimatedBox from './AnimatedBox';

const DEFAULT_COLORS = ["yellow", "yellow", "black", "red"];

const AnimatedBorder = ({
  width = 260,
  height = 250,
  segmentWidth = 30,
  segmentHeight = 20,
  totalSegments = 100,
  duration = 6000,
  colors = DEFAULT_COLORS,
  backgroundColor = 'pink',
  boxExtra = 10,
}) => {
  const progress = useSharedValue(0);
  const [container, setContainer] = useState({ w: 0, h: 0 });
  const MAX_X = container.w - segmentWidth;
  const MAX_Y = container.h - segmentHeight;

  useEffect(() => {
    if (!container.w || !container.h) return;
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, [container, duration]);

  const getBorderPosition = (t) => {
    'worklet';
    let x = 0, y = 0, rotation = 0;

    if (t < 0.25) { x = MAX_X * (t / 0.25); y = 0; rotation = 0; }
    else if (t < 0.5) { x = MAX_X; y = MAX_Y * ((t - 0.25)/0.25); rotation = 90; }
    else if (t < 0.75) { x = MAX_X * (1 - (t - 0.5)/0.25); y = MAX_Y; rotation = 180; }
    else { x = 0; y = MAX_Y * (1 - (t - 0.75)/0.25); rotation = 270; }

    return { x, y, rotation };
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.pinkBox, { width, height, backgroundColor }]}
        onLayout={(e) => setContainer(e.nativeEvent.layout)}
      >
        {container.w && container.h && Array.from({ length: totalSegments }).map((_, index) => (
          <AnimatedBox
            key={index}
            index={index}
            total={totalSegments}
            progress={progress}
            getPosition={getBorderPosition}
            color={colors[Math.floor(index / (totalSegments / colors.length))]}
            segmentWidth={segmentWidth}
            segmentHeight={segmentHeight}
            boxExtra={boxExtra}
          />
        ))}
      </View>
    </View>
  );
};

export default AnimatedBorder;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center' },
  pinkBox: { overflow: 'hidden' },
});
