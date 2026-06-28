import React, { useRef, useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';

export default function AttachmentTelegram({ telegramPost }) {
  const containerRef = useRef(null);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const container = containerRef.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?23';
    script.setAttribute('data-telegram-post', telegramPost);
    script.setAttribute('data-width', '320');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-color', colorScheme === 'dark' ? 'FF5722' : '212121');
    if (colorScheme === 'dark') {
      script.setAttribute('data-dark', '1');
    }
    container.appendChild(script);
    return () => {
      container.innerHTML = '';
    };
  }, [telegramPost, colorScheme]);

  return (
    <div className='attachment attachment--telegram'>
      <div ref={containerRef} />
    </div>
  );
}
