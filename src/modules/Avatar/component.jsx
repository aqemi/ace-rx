'use strict';

import React, { forwardRef } from 'react';
import classnames from 'classnames';
import Avatar from '@mui/material/Avatar';
import PersonOff from '@mui/icons-material/PersonOff';
import { getAvatarColor, getAvatarIcon, getShiftedAvatarColor } from '../../utils';

const AvatarComponent = forwardRef((props, ref) => {
  const { userId, image, className, onClick, bordered } = props;
  if (!userId) {
    return (
      <Avatar className={classnames('avatar', className)} ref={ref}>
        <PersonOff />
      </Avatar>
    );
  }

  const userColor = getAvatarColor(userId);
  const userColorShifted = getShiftedAvatarColor(userId, 60);

  const userBorder =
    bordered && image ? `linear-gradient(135deg, ${userColor} 0%, ${userColorShifted} 100%)` : undefined;

  return (
    <div
      className={classnames({
        'avatar__border-gradient': bordered,
        'avatar__border-gradient--active': bordered && image
      })}
      style={{
        background: userBorder
      }}
    >
      <div
        className={classnames({
          'avatar__border-gap': bordered
        })}
      >
        <Avatar
          ref={ref}
          className={classnames('avatar', className)}
          onClick={onClick}
          src={image}
          sx={{
            bgcolor: userColor
          }}
          title={userId}
        >
          {image ? null : getAvatarIcon(userId)}
        </Avatar>
      </div>
    </div>
  );
});

export default AvatarComponent;
