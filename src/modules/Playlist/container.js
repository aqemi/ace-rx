'use strict';

import { connect } from 'react-redux';
import Component from './component';
import * as playlistActions from './actions';
import { actions as lightboxActions } from '../Lightbox';

function mapStateToProps(state) {
  return {
    items: state.playlist.items,
    selected: state.playlist.selected,
    uploadProgress: state.playlist.uploadProgress
  };
}

const actions = Object.assign({}, playlistActions, { openImage: lightboxActions.openImage });

export default connect(mapStateToProps, actions)(Component);
