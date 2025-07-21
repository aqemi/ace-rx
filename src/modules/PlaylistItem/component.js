'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButtom from 'material-ui/IconButton';
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
          </FontIcon>{' '}
          {item.likes}
          <FontIcon
            className='material-icons'
            color={context.muiTheme.palette.secondaryTextColor}
            style={{ fontSize: '12px', top: '1px', marginLeft: '5px' }}
          >
            thumb_down
          </FontIcon>{' '}
          {item.dislikes}
          <FontIcon />
        </div>
      </div>
      <div className='playlist-item-right'>
        <div className='duration'>{item.length}</div>
        {item.canedit && (
          <IconButtom
            onTouchTap={(e) => {
              e.stopPropagation();
              props.edit(item.id);
            }}
            iconClassName='fa fa-pencil'
            style={{ left: '12px' }}
            iconStyle={{ fontSize: '16px' }}
          />
        )}
      </div>
    </div>
  );
}

PlaylistItem.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired,
  openImage: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired
};

PlaylistItem.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
