'use strict';

import React, { Component } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import classnames from 'classnames';
import theme from '../../themes';
import { Component as LeftHeader } from '../LeftHeader';
import { Container as RightHeader } from '../RightHeader';
import { Container as Playlist } from '../Playlist';
import { Container as Chat } from '../Chat';
import { Container as Player } from '../Player';
import { Container as PostArea } from '../PostArea';
import { Container as Snackbar } from '../Snackbar';
import { Container as Lightbox } from '../Lightbox';
import { Container as Settings } from '../Settings';
import { Container as LogPicker } from '../LogPicker';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistMode: false,
      sidebarContent: 0
    };
    this.postAreaRef = React.createRef();
    this.focusPostArea = this.focusPostArea.bind(this);
  }

  componentDidMount() {
    if (navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
    }
  }

  setSidebarContent(content) {
    this.setState({
      sidebarContent: content
    });
  }

  togglePlaylistMode() {
    this.setState({
      playlistMode: !this.state.playlistMode
    });
  }

  focusPostArea() {
    if (this.postAreaRef.current) {
      this.postAreaRef.current.focus();
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme} noSsr defaultMode='dark'>
        <CssBaseline />
        <div className={classnames('container', { 'playlist-mode': this.state.playlistMode })}>
          <div className='left'>
            <LeftHeader togglePlaylistMode={() => this.togglePlaylistMode()} playlistMode={this.state.playlistMode} />

            <Player />

            {this.state.sidebarContent === 0 ? <Playlist /> : null}
          </div>

          <div className='right'>
            <RightHeader togglePlaylistMode={() => this.togglePlaylistMode()} />
            <Chat focusPostArea={this.focusPostArea} />
            <PostArea ref={this.postAreaRef} />
          </div>
          <Snackbar />
          <Lightbox />
          <Settings />
          <LogPicker />
        </div>
      </ThemeProvider>
    );
  }
}
