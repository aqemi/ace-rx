'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { grey300, grey500 } from 'material-ui/styles/colors';
import { getAvatarColor } from '../../utils';

export default class PlaylistItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      menuAnchor: null
    };
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
    const { secondaryTextColor } = this.context.muiTheme.palette;

    const userColor = getAvatarColor(item.userId);
    const userGlow = `0 0 0 2px ${userColor}, 0 0 6px 1px ${userColor}`;

    const image = item.cover ? (
      <img
        src={item.cover}
        alt={item.str}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          boxShadow: userGlow,
          objectFit: 'cover'
        }}
      />
    ) : (
      <Avatar
        style={{ float: 'left', boxShadow: userGlow }}
        backgroundColor={grey500}
        color={grey300}
        size={64}
        icon={<FontIcon className='fa fa-music' />}
      />
    );

    return (
      <div className={cx('playlist-item', { selected })} onTouchTap={() => this.props.select(item.id)}>
        <div
          className='playlist-item-left'
          onTouchTap={(e) => {
            e.stopPropagation();
            this.props.openImage(item.cover_big);
          }}
        >
          {image}
        </div>
        <div className='playlist-item-center'>
          <div className='title'>{item.str}</div>
          <div className='tags'>{item.tags}</div>
          <div className='rating' style={{ display: 'flex', alignItems: 'center' }}>
            <FontIcon
              className='material-icons'
              color={secondaryTextColor}
              style={{ fontSize: '12px' }}
            >
              thumb_up
            </FontIcon>
            <span style={{ marginLeft: '3px' }}>{item.likes}</span>
            <FontIcon
              className='material-icons'
              color={secondaryTextColor}
              style={{ fontSize: '12px', marginLeft: '5px' }}
            >
              thumb_down
            </FontIcon>
            <span style={{ marginLeft: '3px' }}>{item.dislikes}</span>
            {item.canedit && (
              <IconButton
                tooltip='Edit title'
                tooltipPosition='top-center'
                hoveredStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                style={{ width: '24px', height: '24px', padding: 0, marginLeft: 'auto' }}
                iconStyle={{ fontSize: '12px' }}
                onTouchTap={(e) => {
                  e.stopPropagation();
                  this.props.edit(item.id);
                }}
              >
                <FontIcon
                  className='fa fa-pencil'
                  color={secondaryTextColor}
                />
              </IconButton>
            )}
            {item.candelete && (
              <IconButton
                tooltip='Admin'
                tooltipPosition='top-center'
                hoveredStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                style={{ width: '24px', height: '24px', padding: 0, marginLeft: item.canedit ? '5px' : 'auto' }}
                iconStyle={{ fontSize: '12px' }}
                onTouchTap={e => this.openMenu(e)}
              >
                <FontIcon
                  className='fa fa-ellipsis-v'
                  color={secondaryTextColor}
                />
              </IconButton>
            )}
          </div>
        </div>
        <div className='playlist-item-right'>
          <div className='duration'>{item.length}</div>
        </div>
        <Popover
          open={this.state.menuOpen}
          anchorEl={this.state.menuAnchor}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={() => this.closeMenu()}
        >
          <Menu onItemTouchTap={() => this.closeMenu()} desktop>
            <MenuItem
              primaryText='Delete'
              leftIcon={<FontIcon className='fa fa-trash' />}
              onTouchTap={() => {
                if (window.confirm('Are you sure you want to delete this song?')) {
                  this.props.delete(item.id);
                }
              }}
            />
            <MenuItem
              primaryText='Delete all from user'
              leftIcon={<FontIcon className='fa fa-user-times' />}
              onTouchTap={() => this.props.deleteAllByUser(item.userId)}
            />
            <MenuItem
              primaryText='Info'
              leftIcon={<FontIcon className='fa fa-info' />}
              onTouchTap={() => this.props.info(item.id)}
            />
            <MenuItem
              primaryText='Ban user'
              leftIcon={<FontIcon className='fa fa-ban' />}
              onTouchTap={() => this.props.ban(item.id)}
            />
          </Menu>
        </Popover>
      </div>
    );
  }
}

PlaylistItem.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired,
  openImage: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  deleteAllByUser: PropTypes.func.isRequired,
  info: PropTypes.func.isRequired,
  ban: PropTypes.func.isRequired
};

PlaylistItem.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
