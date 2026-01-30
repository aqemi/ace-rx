'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Container as SelfAvatar } from '../SelfAvatar';
import { Component as ImagePreview } from '../ImagePreview';
import emitter from '../../emitter';

export default class PostArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      file: null
    };
  }

  componentDidMount() {
    emitter.on('reply', this.insertReply.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processing === false && this.props.processing === true) {
      this.unsetFile();
    }
  }

  onKeydown(e) {
    const mode = this.props.settings.postingMode;

    if (e.key === 'Enter') {
      if (mode === 'natural') {
        if (e.ctrlKey || e.metaKey) {
          this.send();
        }
      }
      if (mode === 'inverse') {
        if (!e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      }
    }
  }

  setMessage(message) {
    this.setState({ message });
  }

  setFile(file) {
    console.info(file);
    this.setState({ file });
  }

  unsetFile() {
    this.fileInput.value = '';
    this.setState({ file: null });
  }

  send() {
    this.props.send(this.state.message, this.state.file);
    this.setState({ message: '' });
  }

  insertReply(reply) {
    if (!this.state.message || this.state.message.slice(-1) === '\n') {
      this.setState({ message: `${this.state.message}${reply} ` });
    } else {
      this.setState({ message: `${this.state.message} ${reply} ` });
    }
    // setTimeout to ignore click on popover
    setTimeout(() => this.textarea.focus(), 0);
  }

  render() {
    const { processing, logMode } = this.props;

    if (logMode) {
      return (
        <div className='postarea center'>
          <RaisedButton className='back-button' label='Назад' primary onTouchTap={this.props.exitLog} />
        </div>
      );
    }

    return (
      <div className='postarea'>
        <SelfAvatar />
        <TextArea
          rows={2}
          maxRows={8}
          placeholder='Сообщение'
          maxLength={2048}
          value={this.state.message}
          onChange={e => this.setMessage(e.target.value)}
          onKeyDown={this.onKeydown.bind(this)}
          ref={ref => (this.textarea = ref)}
        />

        <div className='icon-container'>
          <IconButton iconClassName='material-icons' onTouchTap={this.send.bind(this)}>send</IconButton>
          <IconButton iconClassName='material-icons'>add_a_photo</IconButton>

          <input
            ref={ref => (this.fileInput = ref)}
            type='file'
            onChange={e => this.setFile(e.target.files[0])}
          />
        </div>

        <ImagePreview file={this.state.file} processing={processing} unset={this.unsetFile.bind(this)} />
      </div>
    );
  }
}

PostArea.propTypes = {
  processing: PropTypes.bool,
  send: PropTypes.func.isRequired,
  logMode: PropTypes.bool.isRequired,
  exitLog: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};
