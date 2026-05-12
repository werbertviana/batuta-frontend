import { useEffect, useRef, useState } from 'react';

export default function useActivityToast(defaultType = 'warning') {
  const toastTimeoutRef = useRef(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(defaultType);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message, type = defaultType, duration = 1800) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, duration);
  };

  return {
    toastVisible,
    toastMessage,
    toastType,
    showToast,
    setToastVisible,
  };
}