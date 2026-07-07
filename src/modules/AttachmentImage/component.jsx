import React, { Component } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

export default class AttachmentImage extends Component {
  static prependUrl(url) {
    return `${import.meta.env.VITE_WEB_URL}${url}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      loading: false
    };
    // Paints the thumbnail's first frame onto the canvas, freezing animated GIFs/WebP.
    this.setFrozenRef = (canvas) => {
      if (!canvas) {
        return;
      }
      const frame = new Image();
      frame.onload = () => {
        canvas.getContext('2d').drawImage(frame, 0, 0, canvas.width, canvas.height);
      };
      frame.src = AttachmentImage.prependUrl(this.props.picture.thumburl);
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
        loading: expanded
      };
    });
  }

  hideSpinner() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { picture } = this.props;
    const { expanded, loading } = this.state;

    const fileExtension = picture.name.split('.').pop().toUpperCase();
    const frozen = this.isFrozenType();
    // Keep the still frame visible while collapsed, and also while the expanded
    // image is still loading so it stands in for the not-yet-ready animation.
    const showCanvas = frozen && (!expanded || loading);
    const showImage = !frozen || expanded;

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
            onError={this.hideSpinner.bind(this)}
          />
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
