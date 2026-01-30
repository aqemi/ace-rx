'use strict';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { formatDate } from '../../utils';
import { Component as HeaderMenu } from '../HeaderMenu';

export default class RightHeader extends Component {
  render() {
    const { topic, online, logDate } = this.props;

    return (
      <AppBar
        className='right-header'
        title={null}
        iconElementLeft={
          <IconButton
            className='playlist-mode-switch'
            iconClassName='material-icons'
            tooltip='Плейлист'
            onTouchTap={this.props.togglePlaylistMode}
          >
            queue_music
          </IconButton>
        }
        iconElementRight={
          <HeaderMenu ignoreClear={this.props.ignoreClear} openSettings={this.props.openSettings} />
        }
      >
        <div className='topic'>{logDate ? formatDate(logDate) : topic}</div>
        {!logDate && <div className='online'>Онлайн: {online}</div>}
      </AppBar>
    );
  }
}

RightHeader.propTypes = {
  topic: PropTypes.string.isRequired,
  online: PropTypes.string.isRequired,
  togglePlaylistMode: PropTypes.func.isRequired,
  ignoreClear: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired,
  logDate: PropTypes.instanceOf(Date)
};
