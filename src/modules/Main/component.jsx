import React, { Component } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import clsx from 'clsx';
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
import { Container as BanManager } from '../BanManager';
import { Container as AdminLogin } from '../AdminLogin';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistMode: false,
      sidebarContent: 0
    };
    this.postAreaRef = React.createRef();
    this.chatRef = React.createRef();
    this.focusPostArea = this.focusPostArea.bind(this);
    this.scrollChatToBottom = this.scrollChatToBottom.bind(this);
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
    this.setState((prevState) => ({
      playlistMode: !prevState.playlistMode
    }));
  }

  focusPostArea() {
    if (this.postAreaRef.current) {
      this.postAreaRef.current.focus();
    }
  }

  scrollChatToBottom() {
    if (this.chatRef.current) {
      this.chatRef.current.enableAutoscroll();
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme} noSsr defaultMode='dark'>
        <CssBaseline />
        <div className={clsx('container', { 'playlist-mode': this.state.playlistMode })}>
          <div className='left'>
            <LeftHeader togglePlaylistMode={() => this.togglePlaylistMode()} playlistMode={this.state.playlistMode} />

            <Player />

            {this.state.sidebarContent === 0 ? <Playlist /> : null}
          </div>

          <div className='right'>
            <RightHeader togglePlaylistMode={() => this.togglePlaylistMode()} />
            <Chat ref={this.chatRef} focusPostArea={this.focusPostArea} />
            <PostArea ref={this.postAreaRef} onSend={this.scrollChatToBottom} />
          </div>
          <Snackbar />
          <Lightbox />
          <Settings />
          <LogPicker />
          <BanManager />
          <AdminLogin />
        </div>
      </ThemeProvider>
    );
  }
}
