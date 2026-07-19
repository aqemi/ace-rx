import { connect } from 'react-redux';
import Component from './component';
import { close } from './slice';
import { actions as avatar } from '../SelfAvatar';
import { actions as snackbar } from '../Snackbar';

function mapStateToProps(state) {
  return { isOpen: state.adminLogin.isOpen };
}

export default connect(mapStateToProps, {
  onClose: close,
  // On success we reload the avatar endpoint — it returns `isAdmin`, which
  // flips the admin controls on. The server stays the source of truth.
  reloadAvatar: avatar.load,
  notify: snackbar.snackbarOpen
})(Component);
