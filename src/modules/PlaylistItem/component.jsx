'use strict';

import React, { Component } from 'react';
import cx from 'classnames';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import InfoIcon from '@mui/icons-material/Info';
import BlockIcon from '@mui/icons-material/Block';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { getAvatarColor, getShiftedAvatarColor } from '../../utils';

export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      menuAnchor: null
    };
    this.closeMenu = this.closeMenu.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { item, selected } = this.props;
    const { item: nextItem, selected: nextSelected } = nextProps;
    return (
      this.state !== nextState ||
      selected !== nextSelected ||
      item.id !== nextItem.id ||
      item.str !== nextItem.str ||
      item.likes !== nextItem.likes ||
      item.dislikes !== nextItem.dislikes ||
      item.cover !== nextItem.cover
    );
  }

  openMenu(e) {
    e.stopPropagation();
    this.setState({
      menuOpen: true,
      menuAnchor: e.currentTarget
    });
  }

  closeMenu() {
    this.setState({
      menuOpen: false,
      menuAnchor: null
    });
  }

  render() {
    const { item, selected } = this.props;

    const userColor = getAvatarColor(item.userId);
    const shiftedUserColor = getShiftedAvatarColor(item.userId);
    const borderGradient = `linear-gradient(135deg, ${shiftedUserColor} 0%, ${userColor} 100%)`;

    const image = (
      <div className='playlist-item__border-gradient' style={{ background: selected ? undefined : borderGradient }}>
        <div className='playlist-item__border-gap'>
          {item.cover ? (
            <img src={item.cover} alt={item.str} />
          ) : (
            <Avatar className='playlist-item__avatar'>
              <MusicNoteIcon />
            </Avatar>
          )}
        </div>
      </div>
    );

    return (
      <React.Fragment>
        <ListItem disablePadding>
          <ListItemButton
            className={cx('playlist-item', { 'playlist-item--selected': selected })}
            onClick={() => this.props.select(item.id)}
          >
            <IconButton
              className='playlist-item__left'
              disabled={!item.cover}
              onClick={(e) => {
                e.stopPropagation();
                this.props.openImage(item.cover_big);
              }}
            >
              {image}
            </IconButton>
            <div className='playlist-item__center'>
              <div className='playlist-item__title'>{item.str}</div>
              <div className='playlist-item__tags'>{item.tags}</div>
              <div className='playlist-item__rating'>
                {item.likes > 0 && (
                  <React.Fragment>
                    <ThumbUpIcon className='playlist-item__like' />
                    <span>{item.likes}</span>
                  </React.Fragment>
                )}
                {item.dislikes > 0 && (
                  <React.Fragment>
                    <ThumbDownIcon className='playlist-item__dislike' />
                    <span>{item.dislikes}</span>
                  </React.Fragment>
                )}
                {item.canedit && (
                  <IconButton
                    className='playlist-item__edit-btn'
                    title='Edit title'
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      this.props.edit(item.id);
                    }}
                  >
                    <EditIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                )}
                {item.candelete && (
                  <IconButton
                    className='playlist-item__admin-btn'
                    title='Admin'
                    size='small'
                    onClick={(e) => {
                      this.openMenu(e);
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                )}
              </div>
            </div>
            <div className='playlist-item__right'>
              <div className='playlist-item__duration'>{item.length}</div>
            </div>
          </ListItemButton>
        </ListItem>

        <Menu open={this.state.menuOpen} anchorEl={this.state.menuAnchor} onClose={this.closeMenu}>
          <MenuItem
            onClick={() => {
              this.closeMenu();
              if (window.confirm('Are you sure you want to delete this song?')) {
                this.props.delete(item.id);
              }
            }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
              this.props.deleteAllByUser(item.userId);
            }}
          >
            <ListItemIcon>
              <PersonRemoveIcon />
            </ListItemIcon>
            <ListItemText>Delete all from user</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
              this.props.info(item.id);
            }}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText>Info</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
              this.props.ban(item.id);
            }}
          >
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText>Ban user</ListItemText>
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}
