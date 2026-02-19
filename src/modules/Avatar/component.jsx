'use strict';

import React, { forwardRef } from 'react';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import PersonOff from '@mui/icons-material/PersonOff';
import { getAvatarColor, getAvatarIcon } from '../../utils';

const AvatarComponent = forwardRef((props, ref) => {
  const { userId, image, className, onClick } = props;
  if (!userId) {
    return (
      <Avatar className={clsx('avatar', className)} ref={ref}>
        <PersonOff />
      </Avatar>
    );
  }

  const userColor = getAvatarColor(userId);

  return (
    <Avatar
      ref={ref}
      className={clsx('avatar', className)}
      onClick={onClick}
      src={image}
      sx={{
        bgcolor: userColor
      }}
      title={userId}
    >
      {image ? null : getAvatarIcon(userId)}
    </Avatar>
  );
});

export default AvatarComponent;
