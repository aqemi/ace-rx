'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

export default function LeftHeader(props) {
  return (
    <AppBar
      className='left-header'
      showMenuIconButton={false}
      title={import.meta.env.VITE_OG_TITLE}
      iconElementRight={
        <IconButton
          className='chat-mode-switch'
          iconClassName='material-icons'
          onTouchTap={(e) => {
            e.preventDefault();
            props.togglePlaylistMode();
          }}
        >
          chat
        </IconButton>
      }
    />
  );
}

LeftHeader.propTypes = {
  togglePlaylistMode: PropTypes.func.isRequired
};
