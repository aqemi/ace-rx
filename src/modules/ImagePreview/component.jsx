import React, { useState, useEffect, memo } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import { formatBytes } from '../../utils';

function ImagePreview({ file, processing, unset }) {
  const [image, setImage] = useState(null);
  const [dims, setDims] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImage(e.target.result);
      };
    } else {
      setImage(null);
      setDims(null);
    }
  }, [file]);

  useEffect(() => {
    if (!image) {
      return;
    }
    const img = new window.Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = image;
  }, [image]);

  if (!image || !file) {
    return null;
  }

  const ext = file.name.split('.').pop().toUpperCase();
  const fileinfo = `${ext}${dims ? ` ${dims.w}x${dims.h}` : ''} ${formatBytes(file.size)}`;

  return (
    <Paper className='image-preview'>
      <div className='image-preview__thumb'>
        <img src={image} alt='preview' />
        {processing && (
          <IconButton
            className='image-preview__spinner'
            variant='overlay'
            loading
            loadingIndicator={<CircularProgress color='inherit' size={24} />}
          />
        )}
      </div>
      <div className='image-preview__info'>
        <span className='image-preview__name'>{file.name}</span>
        <span className='image-preview__fileinfo'>{fileinfo}</span>
      </div>
      <IconButton className='image-preview__close' disabled={processing} onClick={unset}>
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}

export default memo(ImagePreview);
