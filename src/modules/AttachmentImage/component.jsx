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

    const fileExtension = picture.name.split('.').pop().toUpperCase();

    return (
      <div className='attachment attachment--image'>
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
        {this.state.loading && (
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
