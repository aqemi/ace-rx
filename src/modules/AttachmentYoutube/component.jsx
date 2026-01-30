'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { fullWhite, lightBlack } from 'material-ui/styles/colors';
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
        iconClassName='fa fa-youtube-play'
        style={{
          position: 'absolute',
          top: '51px',
          left: '76px',
          borderRadius: '50%',
          backgroundColor: lightBlack
        }}
        iconStyle={{
          color: fullWhite
        }}
        onTouchTap={this.toggleExpand.bind(this)}
      />
    );

    if (isMobile()) {
      let videoUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
      if (youtubeTimestamp) {
        videoUrl += `&t=${youtubeTimestamp}`;
      }

      return (
        <div className='attachment-youtube'>
          <a href={videoUrl} target='_blank'>
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
      let youtubeUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`;
      if (youtubeTimestamp) {
        youtubeUrl += `&start=${youtubeTimestamp}`;
      }

      return (
        <div className='attachment-youtube'>
          <iframe
            width='560'
            height='315'
            src={youtubeUrl}
            frameBorder='0'
            allowFullScreen
          />
          <a
            href=''
            onClick={e => e.preventDefault()}
            onTouchTap={this.toggleExpand.bind(this)}
          >
            Закрыть
          </a>
        </div>
      );
    }

    return (
      <div className='attachment-youtube'>
        <img
          alt='Youtube video'
          src={thumbnailUrl}
          onTouchTap={this.toggleExpand.bind(this)}
        />
        {icon}
      </div>
    );
  }
}

AttachmentYoutube.propTypes = {
  youtubeVideoId: PropTypes.string.isRequired,
  youtubeTimestamp: PropTypes.string
};
