'use strict';

import React from 'react';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export default function PlaylistUploadButton(props) {
  const { uploadProgress, upload } = props;

  const spinner = !uploadProgress ? null : (
    <CircularProgress className='playlist__upload-spinner' variant='determinate' value={uploadProgress} />
  );

  return (
    <Fab className='playlist__upload-button' size='small' component='label' color='primary'>
      {spinner}
      <PlaylistAddIcon />
      <input type='file' onChange={e => upload(e.target.files[0])} />
    </Fab>
  );
}
