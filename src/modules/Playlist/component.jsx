'use strict';

import React, { Component } from 'react';
import { List } from '@mui/material';
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
    this.edit = this.edit.bind(this);
    this.closeEdit = this.closeEdit.bind(this);
    this.deleteAllByUser = this.deleteAllByUser.bind(this);
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

  deleteAllByUser(userId) {
    const userItems = this.props.items.filter(item => item.userId === userId);
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete ${userItems.length} tracks from this user?`)) {
      this.props.delete(userItems.map(item => item.id).join(','));
    }
  }

  render() {
    const { items, selected, uploadProgress } = this.props;

    return (
      <div className='playlist'>
        <List className='playlist__list'>
          {items.length ? (
            items.map(item => (
              <PlaylistItem
                item={item}
                key={item.id}
                selected={item.id === selected}
                select={this.props.select}
                openImage={this.props.openImage}
                edit={this.edit}
                delete={this.props.delete}
                deleteAllByUser={this.deleteAllByUser}
                info={id => this.props.control('whois_playlist', id)}
                ban={id => this.props.control('ban_playlist', id)}
              />
            ))
          ) : (
            <div className='playlist__placeholder'>Плейлист пуст. Будьте первым кто загрузит трек.</div>
          )}
        </List>
        <PlaylistUploadButton uploadProgress={uploadProgress} upload={this.props.upload} />
        <PlaylistEdit
          id={this.state.editId}
          artist={this.state.editArtist}
          title={this.state.editTitle}
          close={this.closeEdit}
          save={this.props.edit}
        />
      </div>
    );
  }
}
