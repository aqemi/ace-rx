'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scrollbars from 'react-custom-scrollbars';
import { Component as PlaylistItem } from '../PlaylistItem';
import { Component as PlaylistUploadButton } from '../PlaylistUploadButton';
import { Component as PlaylistEdit } from '../PlaylistEdit';

export default class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      editArtist: '',
      editTitle: ''
    };
  }

  edit(id) {
    const item = this.props.items.find(x => x.id === id);
    this.setState({
      editId: item.id,
      editArtist: item.artist,
      editTitle: item.title || item.str
    });
  }

  closeEdit() {
    this.setState({
      editId: null,
      editArtist: '',
      editTitle: ''
    });
  }

  render() {
    const { items, selected, uploadProgress } = this.props;

    return (
      <div className='playlist'>
        {
          items.length
          ?
            <Scrollbars autoHide>
              {
                items.map(item => (
                  <PlaylistItem
                    item={item}
                    key={item.id}
                    selected={item.id === selected}
                    select={this.props.select}
                    openImage={this.props.openImage}
                    edit={this.edit.bind(this)}
                    delete={this.props.delete}
                  />
                ))
              }
            </Scrollbars>
          :
            <div className='placeholder'>
                Плейлист пуст. Будьте первым кто загрузит трек.
            </div>
        }
        <PlaylistUploadButton uploadProgress={uploadProgress} upload={this.props.upload} />
        <PlaylistEdit
          id={this.state.editId}
          artist={this.state.editArtist}
          title={this.state.editTitle}
          close={this.closeEdit.bind(this)}
          save={this.props.edit}
        />
      </div>
    );
  }
}

Playlist.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.string,
  uploadProgress: PropTypes.number,
  select: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  openImage: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};
