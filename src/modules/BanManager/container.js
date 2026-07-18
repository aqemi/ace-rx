import { connect } from 'react-redux';
import Component from './component';
import { close } from './slice';
import { actions as snackbar } from '../Snackbar';

function mapStateToProps(state) {
  return { isOpen: state.banManager.isOpen };
}

export default connect(mapStateToProps, {
  onClose: close,
  notify: snackbar.snackbarOpen
})(Component);
