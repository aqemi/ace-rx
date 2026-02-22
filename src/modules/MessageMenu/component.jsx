'use strict';

import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EmailIcon from '@mui/icons-material/Email';
import { Component as BanDialog } from '../BanDialog';

export default function MessageMenu(props) {
  const [banDialogOpen, setBanDialogOpen] = useState(false);

  function openBanDialog() {
    props.hidePopover();
    setBanDialogOpen(true);
  }

  function handleBanSubmit({ expire, reason }) {
    setBanDialogOpen(false);
    props.onControl('banchat', props.messageId, { expire, reason });
  }

  const controls = !props.hasAdminControls
    ? []
    : [
      <Divider key='divider' />,
      <MenuItem
        key='delmsg'
        onClick={() => {
          props.hidePopover();
          props.onControl('delmsg', props.messageId);
        }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>,
      <MenuItem
        key='delmsgref'
        onClick={() => {
          props.hidePopover();
          props.onControl('delmsgref', props.messageId);
        }}
      >
        <ListItemIcon>
          <DeleteForeverIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Force Delete</ListItemText>
      </MenuItem>,
      <MenuItem key='banchat' onClick={openBanDialog}>
        <ListItemIcon>
          <BlockIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Ban</ListItemText>
      </MenuItem>,
      <MenuItem
        key='whois'
        onClick={() => {
          props.hidePopover();
          props.onControl('whois', props.messageId);
        }}
      >
        <ListItemIcon>
          <PersonSearchIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>IP</ListItemText>
      </MenuItem>
    ];

  return (
    <React.Fragment>
      <Menu
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.hidePopover}
        anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {[
          <MenuItem
            key='reply'
            onClick={() => {
              props.hidePopover();
              props.onReply(`@${props.messageId}`);
            }}
          >
            <ListItemIcon>
              <AlternateEmailIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Ответить</ListItemText>
          </MenuItem>,
          <MenuItem
            key='ignore'
            onClick={() => {
              props.hidePopover();
              props.ignoreAdd(props.messageId);
            }}
          >
            <ListItemIcon>
              <RemoveCircleIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Игнор</ListItemText>
          </MenuItem>,
          <MenuItem
            key='pm'
            onClick={() => {
              props.hidePopover();
              props.onReply(`!#${props.messageId}`);
            }}
          >
            <ListItemIcon>
              <EmailIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>ЛС</ListItemText>
          </MenuItem>,
          ...controls
        ]}
      </Menu>

      <BanDialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)} onSubmit={handleBanSubmit} />
    </React.Fragment>
  );
}
