'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';
import { green900 as likeColor, red900 as dislikeColor } from 'material-ui/styles/colors';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { isMobile } from '../../utils';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      position: 0,
      duration: null,
      volume: typeof localStorage.volume !== 'undefined' ? Number(localStorage.volume) : 0.5
    };
    this.onProgress = throttle(this.onProgress.bind(this), 500);
    this.setVolume = debounce(this.setVolume.bind(this), 100);
  }

  componentDidMount() {
    this.audio.volume = this.state.volume;
  }

  componentDidUpdate(prevProps) {
    // auto play on track selection
    if (this.props.track && get(this.props, 'track.url') !== get(prevProps, 'track.url')) {
      this.play();
    }
  }

  onProgress() {
    this.setState({ position: this.audio.currentTime });
  }

  onEnd() {
    this.setState({
      playing: false,
      position: 0
    });
    this.props.next();
  }

  setDuration() {
    this.setState({
      duration: this.audio.duration
    });
  }

  setVolume(e, value) {
    this.audio.volume = value;
    this.setState({ volume: value });
    localStorage.setItem('volume', value);
  }

  play() {
    this.setState({ playing: true });
    this.audio.play();

    if ('mediaSession' in navigator) {
      const { track } = this.props;
      const title = track.title && track.artist ? track.title : track.str;
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: track.artist || '',
        album: '',
        artwork: track.cover_big ? [{ src: track.cover_big }] : []
      });
    }
  }

  pause() {
    this.setState({ playing: false });
    this.audio.pause();
  }

  seek(e, value) {
    this.audio.currentTime = value * this.state.duration;
  }

  like() {
    this.props.vote(this.props.track.id, 1);
  }

  dislike() {
    this.props.vote(this.props.track.id, -1);
  }

  close() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
    }
    this.props.deselect();
  }

  render() {
    const { track } = this.props;
    const { playing, position, duration, volume } = this.state;
    const url = track ? `${import.meta.env.VITE_WEB_URL}${track.url}` : '';

    const progressBar = (
      <Slider
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16
        }}
        sliderStyle={{
          margin: '0'
        }}
        disableFocusRipple
        value={position / duration}
        onChange={this.seek.bind(this)}
      />
    );

    const volumeBar = isMobile() ? null : (
      <Slider
        style={{
          flex: 1
        }}
        sliderStyle={{
          margin: '15px 0'
        }}
        disableFocusRipple
        value={volume}
        onChange={this.setVolume}
      />
    );

    const playerUI = !track ? null : (
      <div
        key='player'
        className='player'
        style={{
          backgroundImage: `url('${track.cover_big}')`
        }}
      >
        <div className='inner'>
          {progressBar}

          {!playing ? (
            <IconButton onTouchTap={this.play.bind(this)} iconClassName='material-icons'>
              play_arrow
            </IconButton>
          ) : (
            <IconButton onTouchTap={this.pause.bind(this)} iconClassName='material-icons'>
              pause
            </IconButton>
          )}

          <IconButton iconClassName='material-icons' onTouchTap={this.props.next}>
            skip_next
          </IconButton>

          {volumeBar}

          <IconButton href={url} iconClassName='material-icons'>
            file_download
          </IconButton>

          <IconButton
            iconClassName='material-icons'
            iconStyle={
              track.voted !== '1'
                ? {}
                : {
                  color: likeColor
                }
            }
            onTouchTap={this.like.bind(this)}
          >
            thumb_up
          </IconButton>

          <IconButton
            iconClassName='material-icons'
            iconStyle={
              track.voted !== '-1'
                ? {}
                : {
                  color: dislikeColor
                }
            }
            onTouchTap={this.dislike.bind(this)}
          >
            thumb_down
          </IconButton>

          <IconButton iconClassName='material-icons' onTouchTap={() => this.close()}>
            keyboard_arrow_up
          </IconButton>
        </div>
      </div>
    );

    return (
      <ReactCSSTransitionGroup transitionName='player' transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        <audio
          ref={(ref) => { this.audio = ref; }}
          src={url}
          onTimeUpdate={this.onProgress}
          onDurationChange={this.setDuration.bind(this)}
          onEnded={this.onEnd.bind(this)}
        />
        {playerUI}
      </ReactCSSTransitionGroup>
    );
  }
}

Player.propTypes = {
  track: PropTypes.object,
  next: PropTypes.func.isRequired,
  vote: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired
};
