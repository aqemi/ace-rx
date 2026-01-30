'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import IconButton from 'material-ui/IconButton';
import { fullWhite, lightBlack } from 'material-ui/styles/colors';

export default class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file) {
      const reader = new FileReader();
      reader.readAsDataURL(nextProps.file);
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
    } else {
      this.setState({ image: null });
    }
  }

  render() {
    if (!this.state.image) {
      return null;
    }

    const spinner = (
      <RefreshIndicator
        top={26}
        left={26}
        size={48}
        status='loading'
        loadingColor={fullWhite}
        style={{ backgroundColor: lightBlack }}
      />
    );

    const closeButton = (
      <IconButton
        style={{
          backgroundColor: lightBlack,
          borderRadius: '50%'
        }}
        iconStyle={{
          color: fullWhite
        }}
        iconClassName='material-icons'
        onTouchTap={this.props.unset}
      >close</IconButton>
    );

    return (
      <Paper
        style={{
          height: '100px',
          width: '100px',
          position: 'absolute',
          top: '-108px',
          right: '16px',
          backgroundSize: 'cover',
          backgroundImage: `url('${this.state.image}')`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {
          this.props.processing
            ? spinner
            : closeButton
        }
      </Paper>
    );
  }
}

ImagePreview.propTypes = {
  file: PropTypes.object,
  processing: PropTypes.bool,
  unset: PropTypes.func.isRequired
};
