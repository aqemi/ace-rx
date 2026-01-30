'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import { fullWhite } from 'material-ui/styles/colors';

export default function PlaylistUploadButton(props) {
  const { uploadProgress, upload } = props;

  const spinner = !uploadProgress ? null : (
    <CircularProgress
      color={fullWhite}
      mode='determinate'
      value={uploadProgress}
      style={{ position: 'absolute', left: 0 }}
    />
  );

  return (
    <div className='playlist-upload-button'>
      <FloatingActionButton mini>
        {spinner}
        <FontIcon className='material-icons'>playlist_add</FontIcon>
      </FloatingActionButton>

      <input
        type='file'
        onChange={e => upload(e.target.files[0])}
      />
    </div>
  );
}

PlaylistUploadButton.propTypes = {
  uploadProgress: PropTypes.number,
  upload: PropTypes.func.isRequired
};
