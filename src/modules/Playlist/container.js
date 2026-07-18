import { connect } from 'react-redux';
import Component from './component';
import * as playlistActions from './actions';
import { actions as lightboxActions } from '../Lightbox';

function mapStateToProps(state) {
  return {
    items: state.playlist.items,
    loaded: state.playlist.loaded,
    selected: state.playlist.selected,
    uploadProgress: state.playlist.uploadProgress,
    displayAdminControls: state.avatar.isAdmin
  };
}

const actions = { ...playlistActions, openImage: lightboxActions.openImage };

export default connect(mapStateToProps, actions)(Component);
