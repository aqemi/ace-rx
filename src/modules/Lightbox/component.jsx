'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import CircularProgress from 'material-ui/CircularProgress';
import { fullWhite } from 'material-ui/styles/colors';

export default class Lightbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.props.close();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.image && nextProps.image) {
      this.setState({ loading: true });
    }
  }

  loaded() {
    this.setState({ loading: false });
  }

  render() {
    const { image, video } = this.props;

    let content;

    if (image) {
      content = <img src={image} alt={image} onLoad={this.loaded.bind(this)} />;
    }

    if (video) {
      content = (
        <video controls autoPlay>
          <source src={video} type='video/webm' />
        </video>
      );
    }

    if (content) {
      return (
        <Portal isOpened={Boolean(image || video)}>
          <div className='lightbox' onTouchTap={this.props.close}>
            <div
              className='content'
              onTouchTap={e => e.stopPropagation()}
              style={{ opacity: Number(!this.state.loading) }}
            >{content}</div>
            {
              !this.state.loading ? null : (
                <CircularProgress
                  color={fullWhite}
                  size={100}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )
            }
          </div>
        </Portal>
      );
    }

    return null;
  }
}

Lightbox.propTypes = {
  image: PropTypes.string,
  video: PropTypes.string,
  close: PropTypes.func.isRequired
};
