'use strict';

import React, { Component } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Container as SelfAvatar } from '../SelfAvatar';
import { Component as ImagePreview } from '../ImagePreview';

export default class PostArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null
    };

    this.onKeydown = this.onKeydown.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.unsetFile = this.unsetFile.bind(this);
    this.send = this.send.bind(this);
    this.setTextareaRef = this.setTextareaRef.bind(this);
    this.setFileInputRef = this.setFileInputRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.processing === false && prevProps.processing === true) {
      this.unsetFile();
    }
  }

  onKeydown(e) {
    const mode = this.props.postingMode;

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

  setTextareaRef(ref) {
    this.textarea = ref;
  }

  setFileInputRef(ref) {
    this.fileInput = ref;
  }

  focus() {
    setTimeout(() => {
      this.textarea.focus();
      const len = this.textarea.value.length;
      this.textarea.setSelectionRange(len, len);
    }, 0);
  }

  handleMessageChange(e) {
    this.props.setMessage(e.target.value);
  }

  handleFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  unsetFile() {
    this.fileInput.value = '';
    this.setState({ file: null });
  }

  send() {
    this.props.send(this.props.message, this.state.file);
    this.props.setMessage('');
  }

  render() {
    const { message, processing, logMode } = this.props;

    if (logMode) {
      return (
        <div className='postarea postarea--log'>
          <Button className='back-button' variant='contained' color='primary' onClick={this.props.exitLog}>
            ВЫХОД
          </Button>
        </div>
      );
    }

    return (
      <div className='postarea'>
        <Paper className='postarea__paper'>
          <SelfAvatar className='postarea__avatar' />

          <TextareaAutosize
            rows={1}
            maxRows={8}
            placeholder='Сообщение'
            maxLength={2048}
            value={message}
            onChange={this.handleMessageChange}
            onKeyDown={this.onKeydown}
            ref={this.setTextareaRef}
          />
          <IconButton className='postarea__button' component='label'>
            <AddAPhotoIcon />
            <input
              ref={this.setFileInputRef}
              type='file'
              onChange={this.handleFileChange}
            />
          </IconButton>
          <IconButton onClick={this.send} className='postarea__button'>
            <SendIcon />
          </IconButton>
        </Paper>
        <ImagePreview file={this.state.file} processing={processing} unset={this.unsetFile} />
      </div>
    );
  }
}
