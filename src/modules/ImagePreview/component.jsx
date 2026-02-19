'use strict';

import React, { useState, useEffect, memo } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function ImagePreview({ file, processing, unset }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImage(e.target.result);
      };
    } else {
      setImage(null);
    }
  }, [file]);

  if (!image) {
    return null;
  }

  const closeButton = (
    <IconButton className='image-preview__icon' loading={processing} variant='overlay' onClick={unset}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <Paper className='image-preview'>
      <img src={image} alt='preview' />
      {closeButton}
    </Paper>
  );
}

export default memo(ImagePreview);
