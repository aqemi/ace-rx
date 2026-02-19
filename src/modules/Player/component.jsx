'use strict';

import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import DownloadIcon from '@mui/icons-material/Download';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ColorThief from 'colorthief';
import { darken, lighten, alpha } from '@mui/system/colorManipulator';
import { CSSTransition } from 'react-transition-group';
import { Component as MarqueeText } from '../MarqueeText';
import { padTime, isMobile } from '../../utils';

const colorThief = new ColorThief();

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${padTime(secs)}`;
}

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      position: 0,
      seekPosition: null,
      duration: null,
      volume: typeof localStorage.volume !== 'undefined' ? Number(localStorage.volume) : 0.5,
      muted: false,
      overlayColor: null,
    };
    this.onProgress = this.onProgress.bind(this);
    this.seeking = false;
    this.rawColor = null;
    this.playerRef = React.createRef();
  }

  componentDidMount() {
    this.audio.volume = this.state.volume;
  }

  componentDidUpdate(prevProps) {
    if (this.props.track?.url !== prevProps.track?.url) {
      this.play();
      this.extractColor();
    }
    if (this.props.mode !== prevProps.mode) {
      this.applyOverlayColor();
    }
  }

  applyOverlayColor() {
    if (!this.rawColor) return;
    const isDark = this.props.mode === 'dark';
    const adjusted = isDark ? darken(this.rawColor, 0.7) : darken(this.rawColor, 0.5);
    const overlayColor = alpha(adjusted, isDark ? 0.8 : 0.4);
    this.setState({ overlayColor });
  }

  extractColor() {
    const { track } = this.props;
    if (!track || !track.cover_big) {
      this.rawColor = null;
      this.setState({ overlayColor: null });
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.addEventListener('load', () => {
      try {
        const [r, g, b] = colorThief.getColor(img);
        this.rawColor = `rgb(${r}, ${g}, ${b})`;
        this.applyOverlayColor();
      } catch (e) {
        this.rawColor = null;
        this.setState({ overlayColor: null });
      }
    });
    img.src = track.cover_big;
  }

  onProgress() {
    if (!this.seeking) {
      this.setState({ position: this.audio.currentTime });
    }
  }

  onEnd() {
    if (this.props.repeat === 'one') {
      this.audio.currentTime = 0;
      this.audio.play();
      return;
    }
    this.setState({
      playing: false,
      position: 0,
    });
    this.props.next();
  }

  setDuration() {
    this.setState({
      duration: this.audio.duration,
    });
  }

  setVolume(e, value) {
    this.audio.volume = value;
    this.setState({ volume: value, muted: false });
  }

  commitVolume(e, value) {
    localStorage.setItem('volume', value);
  }

  toggleMute() {
    const { muted, volume } = this.state;
    if (muted) {
      this.audio.volume = volume;
      this.setState({ muted: false });
    } else {
      this.audio.volume = 0;
      this.setState({ muted: true });
    }
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
        artwork: track.cover_big ? [{ src: track.cover_big }] : [],
      });
    }
  }

  pause() {
    this.setState({ playing: false });
    this.audio.pause();
  }

  seek(e, value) {
    this.seeking = true;
    this.audio.currentTime = value * this.state.duration;
    this.setState({ seekPosition: value });
  }

  commitSeek(e, value) {
    this.seeking = false;
    this.setState({ seekPosition: null, position: value * this.state.duration });
  }

  like() {
    this.props.vote(this.props.track.id, 1);
  }

  dislike() {
    this.props.vote(this.props.track.id, -1);
  }

  render() {
    const { track, shuffle, repeat } = this.props;
    const { playing, position, seekPosition, duration, volume, muted, overlayColor } = this.state;
    const url = track ? `${import.meta.env.VITE_WEB_URL}${track.url}` : '';

    return (
      <React.Fragment>
        <audio
          ref={(ref) => {
            this.audio = ref;
          }}
          src={url || undefined}
          onTimeUpdate={this.onProgress}
          onDurationChange={this.setDuration.bind(this)}
          onEnded={this.onEnd.bind(this)}
        />
        <CSSTransition
          in={!!track}
          timeout={{ enter: 1000, exit: 0 }}
          classNames="player-roll"
          unmountOnExit
          nodeRef={this.playerRef}
        >
          {/* use wrapper to avoid animation break on change color */}
          <div ref={this.playerRef}>
            {track && (
              <Paper
                className="player"
                elevation={4}
                sx={{
                  backgroundImage: overlayColor
                    ? `linear-gradient( ${overlayColor}, ${overlayColor} ), url('${track.cover_big}')`
                    : undefined,
                }}
              >
                <div className="player__info">
                  <div className="player__text">
                    <MarqueeText className="player__artist">{track?.artist || '\u00A0'}</MarqueeText>
                    <MarqueeText className="player__title">{track?.title || track?.str}</MarqueeText>
                  </div>
                  <div className="player__secondary">
                    <IconButton
                      onClick={this.like.bind(this)}
                      size="small"
                      color="inherit"
                      className={track?.voted === '1' ? 'player__like--active' : ''}
                    >
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={this.dislike.bind(this)}
                      size="small"
                      color="inherit"
                      className={track?.voted === '-1' ? 'player__dislike--active' : ''}
                    >
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                    <IconButton href={url} size="small" color="inherit" className="player__download">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                <div className="player__progress">
                  <span className="player__time">
                    {formatTime(seekPosition !== null ? seekPosition * duration : position)}
                  </span>
                  <Slider
                    className="player__seekbar"
                    value={seekPosition !== null ? seekPosition : position / duration || 0}
                    onChange={this.seek.bind(this)}
                    onChangeCommitted={this.commitSeek.bind(this)}
                    min={0}
                    max={1}
                    step={0.01}
                    size="small"
                  />
                  <span className="player__time">{formatTime(duration)}</span>
                </div>

                <div className="player__controls">
                  <IconButton
                    onClick={this.props.toggleShuffle}
                    size="small"
                    color="inherit"
                    className={shuffle ? 'player__btn--active' : ''}
                  >
                    <ShuffleIcon fontSize="small" />
                  </IconButton>

                  <IconButton onClick={this.props.previous} color="inherit">
                    <SkipPreviousIcon />
                  </IconButton>

                  {!playing ? (
                    <IconButton onClick={this.play.bind(this)} color="inherit" className="player__play-btn">
                      <PlayArrowIcon fontSize="large" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={this.pause.bind(this)} color="inherit" className="player__play-btn">
                      <PauseIcon fontSize="large" />
                    </IconButton>
                  )}

                  <IconButton onClick={this.props.next} color="inherit">
                    <SkipNextIcon />
                  </IconButton>

                  <IconButton
                    onClick={this.props.cycleRepeat}
                    size="small"
                    color="inherit"
                    className={repeat !== 'off' ? 'player__btn--active' : ''}
                  >
                    {repeat === 'one' ? <RepeatOneIcon fontSize="small" /> : <RepeatIcon fontSize="small" />}
                  </IconButton>
                  {!isMobile() && (
                    <div className="player__volume">
                      <IconButton onClick={this.toggleMute.bind(this)} size="small" color="inherit">
                        {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                      </IconButton>
                      <div className="player__volume-popup">
                        <Slider
                          value={muted ? 0 : volume}
                          onChange={this.setVolume.bind(this)}
                          onChangeCommitted={this.commitVolume.bind(this)}
                          min={0}
                          max={1}
                          step={0.01}
                          size="small"
                          orientation="vertical"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Paper>
            )}
          </div>
        </CSSTransition>
      </React.Fragment>
    );
  }
}
