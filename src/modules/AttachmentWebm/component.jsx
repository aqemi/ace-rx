import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import VideoFile from '@mui/icons-material/VideoFile';
import BrokenImage from '@mui/icons-material/BrokenImage';
import { getExtWebmThumbnail } from '../../utils';

export default class AttachmentWebm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      thumbWidth: null,
      thumbHeight: null,
      thumbError: false,
      videoLoaded: false,
      videoError: false
    };
    this.handleThumbLoad = this.handleThumbLoad.bind(this);
    this.handleThumbError = this.handleThumbError.bind(this);
    this.handleVideoLoaded = this.handleVideoLoaded.bind(this);
    this.handleVideoError = this.handleVideoError.bind(this);
    // A remounted thumbnail (e.g. after minimizing an expired webm) may already be
    // complete before React attaches onLoad/onError, so resolve its state directly.
    this.setThumbRef = (img) => {
      if (!img || !img.complete) {
        return;
      }
      if (img.naturalWidth) {
        this.handleThumbLoad({ target: img });
      } else {
        this.handleThumbError();
      }
    };
  }

  toggleExpand() {
    this.setState((state) => ({
      expanded: !state.expanded,
      videoLoaded: false,
      videoError: false
    }));
  }

  handleThumbLoad(e) {
    this.setState({
      thumbWidth: e.target.naturalWidth,
      thumbHeight: e.target.naturalHeight,
      thumbError: false
    });
  }

  handleThumbError() {
    this.setState({ thumbError: true });
  }

  handleVideoLoaded() {
    this.setState({ videoLoaded: true });
  }

  handleVideoError() {
    this.setState({ videoError: true });
  }

  render() {
    const { extWebmUrl } = this.props;
    const thumbnailUrl = getExtWebmThumbnail(extWebmUrl);
    const { thumbWidth, thumbHeight } = this.state;

    const icon = (
      <IconButton className='attachment__icon' variant='overlay' onClick={this.toggleExpand.bind(this)}>
        <VideoFile />
      </IconButton>
    );

    // Match the placeholder to the original thumbnail size; fall back to the Less
    // default (120x90) when the thumbnail never loaded so we have no dimensions.
    const placeholder = (
      <div
        className='attachment__thumb-placeholder'
        style={thumbWidth ? { width: thumbWidth, height: thumbHeight } : undefined}
      >
        <BrokenImage />
      </div>
    );

    if (this.state.expanded) {
      const { videoLoaded, videoError } = this.state;
      const videoStyle = !videoLoaded && thumbWidth ? { width: thumbWidth, height: thumbHeight } : {};
      return (
        <div>
          <div className='attachment attachment--webm'>
            <div className='attachment__inline'>
              {videoError ? placeholder : (
                <video
                  controls
                  autoPlay
                  src={extWebmUrl}
                  style={videoStyle}
                  onLoadedData={this.handleVideoLoaded}
                  onError={this.handleVideoError}
                />
              )}
              <a
                href=''
                onClick={(e) => {
                  e.preventDefault();
                  this.toggleExpand();
                }}
              >
                Закрыть
              </a>
            </div>
          </div>
        </div>
      );
    }

    const thumbLoaded = thumbWidth !== null && !this.state.thumbError;

    return (
      <div className='attachment attachment--webm'>
        <div className='attachment__inline'>
          <img
            alt='webm'
            ref={this.setThumbRef}
            src={thumbnailUrl}
            onLoad={this.handleThumbLoad}
            onError={this.handleThumbError}
            onClick={this.toggleExpand.bind(this)}
            style={thumbLoaded ? {} : { display: 'none' }}
          />
          {!thumbLoaded && placeholder}
          {thumbLoaded && icon}
        </div>
      </div>
    );
  }
}
