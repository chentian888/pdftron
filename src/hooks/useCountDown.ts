import { useEffect, useRef, useState } from 'react';

export default function useCountDown(initCount = 60, callBack = () => {}) {
  const timeId = useRef<{ id: number }>({ id: 0 });
  const [count, setCount] = useState(initCount);
  const [sendable, setSentable] = useState(true);

  const start = () => {
    setCount(initCount);
    setSentable(false);
    timeId.current.id = window.setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
  };

  useEffect(() => window.clearInterval(timeId.current.id), []);
  useEffect(() => {
    if (count === 0) {
      clearInterval(timeId.current.id);
      setSentable(true);
      callBack();
    }
  }, [callBack, count]);
  return { start, count, sendable };
}
