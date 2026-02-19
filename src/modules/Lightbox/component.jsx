'use strict';

import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Lightbox({ image, video, close }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) setLoading(true);
  }, [image]);

  const handleLoad = () => setLoading(false);

  let content = null;

  if (image) {
    content = <img src={image} alt={image} onLoad={handleLoad} onClick={e => e.stopPropagation()} />;
  }

  if (video) {
    content = (
      <video controls autoPlay onClick={e => e.stopPropagation()}>
        <source src={video} type='video/webm' />
      </video>
    );
  }

  return (
    <Backdrop className='lightbox' open={Boolean(image || video)} onClick={close}>
      {content}
      {loading && <CircularProgress size={100} />}
    </Backdrop>
  );
}
