'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { fullWhite, lightBlack } from 'material-ui/styles/colors';
import { Component as Avatar } from '../Avatar';

export default function SelfAvatar(props) {
  return (
    <div className='avatar'>
      <Avatar image={props.image} userId={props.userId} />
      {
        <RefreshIndicator
          top={0}
          left={0}
          size={36}
          loadingColor={fullWhite}
          status={props.uploading ? 'loading' : 'hide'}
          style={{
            backgroundColor: lightBlack
          }}
        />
      }
      <input
        type='file'
        onChange={e => props.upload(e.target.files[0])}
      />
    </div>
  );
}

SelfAvatar.propTypes = {
  userId: PropTypes.string,
  image: PropTypes.string,
  uploading: PropTypes.bool,
  upload: PropTypes.func.isRequired
};
