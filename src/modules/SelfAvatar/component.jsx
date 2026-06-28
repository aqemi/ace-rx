import React from 'react';
import { IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import { Component as Avatar } from '../Avatar';

export default function SelfAvatar(props) {
  return (
    <IconButton
      component='label'
      size='small'
      className={props.className}
    >
      {props.loading
        ? <Skeleton variant='circular' animation='wave' className='self-avatar__skeleton' />
        : <Avatar image={props.image} userId={props.userId} />}
      {props.uploading && (
        <IconButton
          component='span'
          className='self-avatar__spinner'
          variant='overlay'
          loading
          loadingIndicator={<CircularProgress color='inherit' size={24} />}
        />
      )}
      <input type='file' onChange={(e) => props.upload(e.target.files[0])} />
    </IconButton>
  );
}
