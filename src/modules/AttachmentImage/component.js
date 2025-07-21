'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { fullWhite, lightBlack } from 'material-ui/styles/colors';

export default class AttachmentImage extends Component {
  static prependUrl(url) {
    return `${process.env.WEB_URL}${url}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      loading: false
    };
  }

  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded,
      loading: !this.state.expanded
    });
  }

  hideSpinner() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { picture } = this.props;

    const fileExtension = picture.name.split('.').pop().toUpperCase();

    return (
      <div className='attachment-image'>
        <img
          src={AttachmentImage.prependUrl(this.state.expanded ? picture.imgurl : picture.thumburl)}
          alt='Изображение недоступно'
          style={{
            height: this.state.expanded ? null : `${picture.thumbh}px`,
            width: this.state.expanded ? null : `${picture.thumbw}px`
          }}
          onClick={this.toggleExpand.bind(this)}
          onLoad={this.hideSpinner.bind(this)}
          onError={this.hideSpinner.bind(this)}
        />
        <RefreshIndicator
          top={(picture.thumbh / 2) - 20}
          left={(picture.thumbw / 2) - 20}
          loadingColor={fullWhite}
          status={this.state.loading ? 'loading' : 'hide'}
          style={{
            backgroundColor: lightBlack,
            pointerEvents: 'none'
          }}
        />
        <div className='fileinfo'>{fileExtension} {picture.filedata}</div>
      </div>
    );
  }
}

AttachmentImage.propTypes = {
  picture: PropTypes.object.isRequired
};
