import React from 'react';
import { useSpring, animated } from 'react-spring';

import useReduceMotion from '../../hooks/use-reduce-motion.hook';

const ScaleIn = ({ delay, children }) => {
  const reduceMotion = useReduceMotion();

  const props = useSpring({
    transform: 'scale(1)',
    from: {
      transform: 'scale(0)',
    },
    config: {
      tension: 200,
      friction: 12,
    },
    delay,
    immediate: reduceMotion,
  });

  return <animated.div style={props}>{children}</animated.div>;
};

export default ScaleIn;
