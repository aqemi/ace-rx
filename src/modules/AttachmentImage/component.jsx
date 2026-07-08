import React, { Component } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import BrokenImage from '@mui/icons-material/BrokenImage';

export default class AttachmentImage extends Component {
  static prependUrl(url) {
    return `${import.meta.env.VITE_WEB_URL}${url}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      loading: false,
      error: false
    };
    // Paints the thumbnail's first frame onto the canvas, freezing animated GIFs/WebP.
    this.setFrozenRef = (canvas) => {
      if (!canvas) {
        return;
      }
      const frame = new Image();
      const draw = () => {
        canvas.getContext('2d').drawImage(frame, 0, 0, canvas.width, canvas.height);
      };
      frame.onload = draw;
      frame.onerror = () => this.handleError();
      frame.src = AttachmentImage.prependUrl(this.props.picture.thumburl);
      // On remount the thumbnail is already cached, so onload/onerror may never
      // fire — resolve straight away when the image is already complete.
      if (frame.complete) {
        if (frame.naturalWidth) {
          draw();
        } else {
          this.handleError();
        }
      }
    };
  }

  isFrozenType() {
    const fileExtension = this.props.picture.name.split('.').pop().toUpperCase();
    const isAnimated = fileExtension === 'GIF' || fileExtension === 'WEBP';
    return isAnimated && !this.props.autoplayGifs;
  }

  toggleExpand() {
    this.setState((prevState) => {
      const expanded = !prevState.expanded;
      return {
        expanded,
        loading: expanded,
        error: false
      };
    });
  }

  hideSpinner() {
    this.setState({
      loading: false,
      error: false
    });
  }

  handleError() {
    this.setState({
      loading: false,
      error: true
    });
  }

  render() {
    const { picture } = this.props;
    const { expanded, loading, error } = this.state;

    const fileExtension = picture.name.split('.').pop().toUpperCase();
    const frozen = this.isFrozenType();
    // Keep the still frame visible while collapsed, and also while the expanded
    // image is still loading so it stands in for the not-yet-ready animation.
    const showCanvas = !error && frozen && (!expanded || loading);
    const showImage = !error && (!frozen || expanded);

    return (
      <div className='attachment attachment--image'>
        {showCanvas && (
          <canvas
            ref={this.setFrozenRef}
            width={picture.thumbw}
            height={picture.thumbh}
            style={{ height: `${picture.thumbh}px`, width: `${picture.thumbw}px` }}
            onClick={this.toggleExpand.bind(this)}
          />
        )}
        {showImage && (
          <img
            src={AttachmentImage.prependUrl(expanded ? picture.imgurl : picture.thumburl)}
            alt='Изображение недоступно'
            style={{
              height: expanded ? null : `${picture.thumbh}px`,
              width: expanded ? null : `${picture.thumbw}px`,
              display: showCanvas ? 'none' : null
            }}
            onClick={this.toggleExpand.bind(this)}
            onLoad={this.hideSpinner.bind(this)}
            onError={this.handleError.bind(this)}
          />
        )}
        {error && (
          <div
            className='attachment__placeholder'
            style={{ width: `${picture.thumbw}px`, height: `${picture.thumbh}px` }}
            onClick={this.toggleExpand.bind(this)}
          >
            <BrokenImage />
          </div>
        )}
        {loading && (
          <IconButton
            className='attachment__spinner'
            variant='overlay'
            loading
            loadingIndicator={<CircularProgress color='inherit' size={24} />}
            sx={{ top: picture.thumbh / 2 - 20, left: picture.thumbw / 2 - 20 }}
          />
        )}
        <div className='attachment__fileinfo'>
          {fileExtension} {picture.filedata}
        </div>
      </div>
    );
  }
}
