import { useEffect } from 'react';

const useInterval = (callback, delay) => {
  useEffect(() => {
    if (!delay) {
      return;
    }

    const interval = setInterval(() => {
      if (callback) {
        callback();
      }
    }, delay);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [delay]);
};

export default useInterval;
