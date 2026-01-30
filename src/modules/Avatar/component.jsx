'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import MaterialAvatar from 'material-ui/Avatar';
import {
  getAvatarColor,
  getAvatarIcon
} from '../../utils';

export default function Avatar(props) {
  const { userId, image } = props;
  return (
    <MaterialAvatar
      size={36}
      backgroundColor={getAvatarColor(userId)}
      src={image}
      style={{
        fontWeight: 300,
        cursor: 'pointer'
      }}
      title={userId}
    >
      {image ? null : getAvatarIcon(userId)}
    </MaterialAvatar>
  );
}

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  image: PropTypes.string
};
