'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { grey300, grey500 } from 'material-ui/styles/colors';
import { getAvatarColor } from '../../utils';

export default function PlaylistItem(props, context) {
  const { item, selected } = props;

  const image = item.cover ? (
    <img src={item.cover} alt={item.str} />
  ) : (
    <Avatar
      style={{ float: 'left' }}
      backgroundColor={grey500}
      color={grey300}
      size={64}
      icon={<FontIcon className='fa fa-music' />}
    />
  );

  const userIndicator = <div className='user-indicator' style={{ backgroundColor: getAvatarColor(item.userId) }} />;

  return (
    <div className={cx('playlist-item', { selected })} onTouchTap={() => props.select(item.id)}>
      {userIndicator}
      <div
        className='playlist-item-left'
        onTouchTap={(e) => {
          e.stopPropagation();
          props.openImage(item.cover_big);
        }}
      >
        {image}
      </div>
      <div className='playlist-item-center'>
        <div className='title'>{item.str}</div>
        <div className='tags'>{item.tags}</div>
        <div className='rating'>
          <FontIcon
            className='material-icons'
            color={context.muiTheme.palette.secondaryTextColor}
            style={{ fontSize: '12px', top: '1px' }}
          >
            thumb_up
          </FontIcon>
          <span style={{ marginLeft: '3px' }}>{item.likes}</span>
          <FontIcon
            className='material-icons'
            color={context.muiTheme.palette.secondaryTextColor}
            style={{ fontSize: '12px', top: '1px', marginLeft: '5px' }}
          >
            thumb_down
          </FontIcon>
          <span style={{ marginLeft: '3px' }}>{item.dislikes}</span>
          {item.canedit && (
            <IconButton
              hoveredStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              style={{ width: '24px', height: '24px', padding: 0, marginLeft: '5px' }}
              iconStyle={{ fontSize: '12px' }}
              onTouchTap={(e) => {
                e.stopPropagation();
                props.edit(item.id);
              }}
            >
              <FontIcon
                className='fa fa-pencil'
                color={context.muiTheme.palette.secondaryTextColor}
              />
            </IconButton>
          )}
          {item.candelete && (
            <IconButton
              hoveredStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              style={{ width: '24px', height: '24px', padding: 0, marginLeft: '5px'}}
              iconStyle={{ fontSize: '12px' }}
              onTouchTap={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this song?')) {
                  props.delete(item.id);
                }
              }}
            >
              <FontIcon
                className='fa fa-trash'
                color={context.muiTheme.palette.secondaryTextColor}
              />
            </IconButton>
          )}
        </div>
      </div>
      <div className='playlist-item-right'>
        <div className='duration'>{item.length}</div>
      </div>
    </div>
  );
}

PlaylistItem.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired,
  openImage: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};

PlaylistItem.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
