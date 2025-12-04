import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useBorderAnimation } from './useBorderAnimation';
import AnimatedSegment from './AnimatedSegment';

/* ================= DEFAULT PROPS ================= */
const DEFAULT_COLORS = ['yellow', 'yellow', 'black', 'red'];

const AnimatedBorder = ({
  width = 260,
  height = 250,
  segmentWidth = 30,
  segmentHeight = 20,
  totalSegments = 100,
  duration = 6000,
  colors = DEFAULT_COLORS,
  backgroundColor = 'transparent',
  boxExtra = 10,
  containerStyle,
}) => {
  const [container, setContainer] = useState({ w: 0, h: 0 });

  const progress = useBorderAnimation(container, duration);

  const MAX_X = container.w - segmentWidth;
  const MAX_Y = container.h - segmentHeight;

  /* ---- Border Path Logic ---- */
  const getBorderPosition = useCallback((t) => {
    'worklet';
    let x = 0, y = 0, rotation = 0;

    if (t < 0.25) {
      x = MAX_X * (t / 0.25);
      y = 0;
      rotation = 0;
    } else if (t < 0.5) {
      x = MAX_X;
      y = MAX_Y * ((t - 0.25) / 0.25);
      rotation = 90;
    } else if (t < 0.75) {
      x = MAX_X * (1 - (t - 0.5) / 0.25);
      y = MAX_Y;
      rotation = 180;
    } else {
      x = 0;
      y = MAX_Y * (1 - (t - 0.75) / 0.25);
      rotation = 270;
    }

    return { x, y, rotation };
  }, [MAX_X, MAX_Y]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.borderBox,
          { width, height, backgroundColor },
        ]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setContainer({ w: width, h: height });
        }}
      >
        {container.w &&
          container.h &&
          Array.from({ length: totalSegments }).map((_, index) => (
            <AnimatedSegment
              key={index}
              index={index}
              total={totalSegments}
              progress={progress}
              getPosition={getBorderPosition}
              color={
                colors[
                  Math.floor(
                    index / (totalSegments / colors.length)
                  )
                ]
              }
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderBox: {
    overflow: 'hidden',
  },
});
