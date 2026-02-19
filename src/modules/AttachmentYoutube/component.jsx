'use strict';

import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import YouTube from '@mui/icons-material/YouTube';
import { isMobile } from '../../utils';
import { getYoutubeThumbnail } from '../../utils/youtube';

export default class AttachmentYoutube extends Component {
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
    const { youtubeVideoId, youtubeTimestamp } = this.props;
    const thumbnailUrl = getYoutubeThumbnail(youtubeVideoId);

    const icon = (
      <IconButton
        className='attachment__icon'
        variant='overlay'
        onClick={this.toggleExpand.bind(this)}
      >
        <YouTube />
      </IconButton>
    );

    if (isMobile()) {
      let videoUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
      if (youtubeTimestamp) {
        videoUrl += `&t=${youtubeTimestamp}`;
      }

      return (
        <div className='attachment attachment--youtube'>
          <a href={videoUrl} target='_blank' rel='noopener noreferrer'>
            <img
              alt='Youtube video'
              src={thumbnailUrl}
            />
            {icon}
          </a>
        </div>
      );
    }

    if (this.state.expanded) {
      let youtubeUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1`;
      if (youtubeTimestamp) {
        youtubeUrl += `&start=${youtubeTimestamp}`;
      }

      return (
        <div className='attachment attachment--youtube'>
          <iframe
            width='560'
            height='315'
            src={youtubeUrl}
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          />
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
      <div className='attachment attachment--youtube'>
        <img
          alt='Youtube video'
          src={thumbnailUrl}
          onClick={this.toggleExpand.bind(this)}
        />
        {icon}
      </div>
    );
  }
}
