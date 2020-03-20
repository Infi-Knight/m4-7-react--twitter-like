/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

export default function useReduceMotion() {
  if (typeof window === 'undefined') {
    return false;
  }

  const query = '(prefers-reduced-motion: no-preference)';

  const { current: mediaQueryList } = React.useRef(window.matchMedia(query));

  const [reduceMotion, setReduceMotion] = React.useState(
    !mediaQueryList.matches
  );

  React.useEffect(() => {
    const listener = event => {
      setReduceMotion(!event.matches);
    };

    mediaQueryList.addListener(listener);

    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, [mediaQueryList, setReduceMotion]);

  return reduceMotion;
}
