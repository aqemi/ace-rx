'use strict';

import React from 'react';
import { IconButton } from '@mui/material';
import { Component as Avatar } from '../Avatar';

export default function SelfAvatar(props) {
  return (
    <IconButton
      variant={props.uploading ? 'overlay' : undefined}
      loading={props.uploading}
      component='label'
      size='small'
      className={props.className}
    >
      <Avatar image={props.image} userId={props.userId} />
      <input type='file' onChange={e => props.upload(e.target.files[0])} />
    </IconButton>
  );
}
