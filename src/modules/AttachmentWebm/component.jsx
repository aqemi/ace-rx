'use strict';

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
      videoLoaded: false
    };
    this.handleThumbLoad = this.handleThumbLoad.bind(this);
    this.handleVideoLoaded = this.handleVideoLoaded.bind(this);
  }

  toggleExpand() {
    this.setState(state => ({
      expanded: !state.expanded,
      videoLoaded: false
    }));
  }

  handleThumbLoad(e) {
    this.setState({
      thumbWidth: e.target.naturalWidth,
      thumbHeight: e.target.naturalHeight
    });
  }

  handleVideoLoaded() {
    this.setState({ videoLoaded: true });
  }

  render() {
    const { extWebmUrl } = this.props;
    const thumbnailUrl = getExtWebmThumbnail(extWebmUrl);

    const icon = (
      <IconButton className='attachment__icon' variant='overlay' onClick={this.toggleExpand.bind(this)}>
        <VideoFile />
      </IconButton>
    );

    if (this.state.expanded) {
      const { thumbWidth, thumbHeight, videoLoaded } = this.state;
      const videoStyle = !videoLoaded && thumbWidth ? { width: thumbWidth, height: thumbHeight } : {};
      return (
        <div>
          <div className='attachment attachment--webm'>
            <div className='attachment__inline'>
              <video controls autoPlay style={videoStyle} onLoadedData={this.handleVideoLoaded}>
                <source srwsc={extWebmUrl} type='video/webm' />
              </video>
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

    const thumbLoaded = this.state.thumbWidth !== null;

    return (
      <div className='attachment attachment--webm'>
        <div className='attachment__inline'>
          <img
            alt='webm'
            src={thumbnailUrl}
            onLoad={this.handleThumbLoad}
            onClick={this.toggleExpand.bind(this)}
            style={thumbLoaded ? {} : { display: 'none' }}
          />
          {!thumbLoaded && <div className='attachment__thumb-placeholder'><BrokenImage /></div>}
          {thumbLoaded && icon}
        </div>
      </div>
    );
  }
}
