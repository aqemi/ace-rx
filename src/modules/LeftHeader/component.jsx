'use strict';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChatIcon from '@mui/icons-material/Chat';

export default function LeftHeader(props) {
  return (
    <AppBar position="static" className="left-header">
      <Toolbar>
        <Typography variant="h5">{import.meta.env.VITE_OG_TITLE}</Typography>
        <IconButton
          color="inherit"
          className="left-header__chat-mode-switch"
          onClick={(e) => {
            e.preventDefault();
            props.togglePlaylistMode();
          }}
        >
          <ChatIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
