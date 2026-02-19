'use strict';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import MarqueeText from '../MarqueeText/component';
import React, { Component } from 'react';
import { formatDate } from '../../utils';
import { Component as HeaderMenu } from '../HeaderMenu';

export default class RightHeader extends Component {
  render() {
    const { topic, online, logDate } = this.props;

    return (
      <AppBar position='static' className='right-header'>
        <Toolbar>
          <IconButton
            color='inherit'
            className='right-header__playlist-mode-switch'
            onClick={this.props.togglePlaylistMode}
            title='Плейлист'
          >
            <QueueMusicIcon />
          </IconButton>
          <div className='right-header__content'>
            <MarqueeText className='topic'>
              {logDate ? `Вы просматриваете логи за ${formatDate(logDate)}` : topic}
            </MarqueeText>
            {!logDate && <div className='online'>Сейчас онлайн: {online}</div>}
          </div>
          <HeaderMenu
            ignoreClear={this.props.ignoreClear}
            openSettings={this.props.openSettings}
            openLogPicker={this.props.openLogPicker}
          />
        </Toolbar>
      </AppBar>
    );
  }
}
