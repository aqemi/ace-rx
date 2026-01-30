'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { fullWhite, lightBlack } from 'material-ui/styles/colors';
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
        iconClassName='fa fa-film'
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-24px 0 0 -24px',
          borderRadius: '50%',
          backgroundColor: lightBlack
        }}
        iconStyle={{
          color: fullWhite,
          fontSize: '12px'
        }}
        onTouchTap={this.toggleExpand.bind(this)}
      />
    );

    if (this.state.expanded) {
      return (
        <div className='attachment-webm'>
          <video
            controls
            autoPlay
          >
            <source src={extWebmUrl} type='video/webm' />
          </video>
          <a
            href=''
            onTouchTap={this.toggleExpand.bind(this)}
          >
            Закрыть
          </a>
        </div>
      );
    }

    return (
      <div className='attachment-webm'>
        <img
          alt='webm'
          src={thumbnailUrl}
          onClick={e => e.preventDefault()}
          onTouchTap={this.toggleExpand.bind(this)}
        />
        {icon}
      </div>
    );
  }
}

AttachmentWebm.propTypes = {
  extWebmUrl: PropTypes.string.isRequired
};
