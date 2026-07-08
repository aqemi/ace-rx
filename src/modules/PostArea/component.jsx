import React, { Component } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { isMobile } from '../../utils';
import { Container as SelfAvatar } from '../SelfAvatar';
import { Component as ImagePreview } from '../ImagePreview';

export default class PostArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      dragging: false
    };

    this.dragCounter = 0;

    this.onKeydown = this.onKeydown.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.unsetFile = this.unsetFile.bind(this);
    this.send = this.send.bind(this);
    this.setTextareaRef = this.setTextareaRef.bind(this);
    this.setFileInputRef = this.setFileInputRef.bind(this);
  }

  componentDidMount() {
    document.addEventListener('dragover', PostArea.handleDragOver);
    document.addEventListener('dragenter', this.handleDragEnter);
    document.addEventListener('dragleave', this.handleDragLeave);
    document.addEventListener('drop', this.handleDrop);
    document.addEventListener('paste', this.handlePaste);
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', PostArea.handleDragOver);
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.removeEventListener('dragleave', this.handleDragLeave);
    document.removeEventListener('drop', this.handleDrop);
    document.removeEventListener('paste', this.handlePaste);
  }

  static handleDragOver(e) {
    e.preventDefault();
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

  setImageFile(file) {
    if (file && file.type.startsWith('image/')) {
      this.setState({ file });
    } else if (file) {
      this.props.snackbarOpen('Only images can be attached');
    }
  }

  handleFileChange(e) {
    this.setImageFile(e.target.files[0]);
  }

  handleDragEnter(e) {
    e.preventDefault();
    this.dragCounter += 1;
    if (this.dragCounter === 1) {
      this.setState({ dragging: true });
    }
  }

  handleDragLeave() {
    this.dragCounter -= 1;
    if (this.dragCounter === 0) {
      this.setState({ dragging: false });
    }
  }

  handlePaste(e) {
    const items = Array.from(e.clipboardData?.items ?? []);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    if (imageItem) {
      e.preventDefault();
      this.setImageFile(imageItem.getAsFile());
    }
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragCounter = 0;
    this.setState({ dragging: false });
    this.setImageFile(e.dataTransfer.files[0]);
  }

  unsetFile() {
    this.fileInput.value = '';
    this.setState({ file: null });
  }

  async send() {
    try {
      await this.props.send(this.props.message, this.state.file);
      this.unsetFile();
      this.props.onSend?.();
    } catch (err) {
      // keep file and message on failure
    }
  }

  render() {
    const { message, processing, logMode } = this.props;
    const { file, dragging } = this.state;
    const placeholder = isMobile() ? 'Сообщение' : 'Сообщение — вставьте или перетащите изображение';

    if (logMode) {
      return (
        <div className='postarea postarea--log'>
          <Paper className='postarea__paper'>
            <Button className='back-button' variant='contained' color='primary' onClick={this.props.exitLog}>
              ВЫХОД
            </Button>
          </Paper>
        </div>
      );
    }

    return (
      <div className='postarea'>
        <Backdrop className='postarea__drop-overlay' open={dragging}>
          <Typography variant='h5'>Drop image here</Typography>
        </Backdrop>
        <ImagePreview file={file} processing={processing} unset={this.unsetFile} />
        <Paper className='postarea__paper'>
          <SelfAvatar className='postarea__avatar' />

          <TextareaAutosize
            rows={1}
            maxRows={8}
            placeholder={placeholder}
            maxLength={2048}
            value={message}
            onChange={this.handleMessageChange}
            onKeyDown={this.onKeydown}
            ref={this.setTextareaRef}
            disabled={processing}
          />
          <IconButton className='postarea__button' component='label' disabled={processing}>
            <AddAPhotoIcon />
            <input ref={this.setFileInputRef} type='file' onChange={this.handleFileChange} />
          </IconButton>
          <IconButton onClick={this.send} className='postarea__button' disabled={processing}>
            <SendIcon />
          </IconButton>
        </Paper>
      </div>
    );
  }
}
