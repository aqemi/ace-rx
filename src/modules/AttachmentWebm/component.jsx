'use strict';

import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import VideoFile from '@mui/icons-material/VideoFile';
import { getExtWebmThumbnail } from '../../utils';

export default class AttachmentWebm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }


  render() {
    const { extWebmUrl } = this.props;
    const thumbnailUrl = getExtWebmThumbnail(extWebmUrl);

    const icon = (
      <IconButton
        className='attachment__icon'
        variant='overlay'
        onClick={this.toggleExpand.bind(this)}
      >
        <VideoFile />
      </IconButton>
    );

    if (this.state.expanded) {
      return (
        <div className='attachment attachment--webm'>
          <video
            controls
            autoPlay
          >
            <source src={extWebmUrl} type='video/webm' />
          </video>
          <a
            href=''
            onClick={(e) => { e.preventDefault(); this.toggleExpand(); }}
          >
            Закрыть
          </a>
        </div>
      );
    }

    return (
      <div className='attachment attachment--webm'>
        <img
          alt='webm'
          src={thumbnailUrl}
          onClick={this.toggleExpand.bind(this)}
        />
        {icon}
      </div>
    );
  }
}
