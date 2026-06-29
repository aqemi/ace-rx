import { connect } from 'react-redux';
import Component from './component';
import * as chat from '../Chat/actions';
import { setMessage } from './actions';
import { snackbarOpen } from '../Snackbar/actions';

function mapStateToProps(state) {
  return {
    message: state.postarea.message,
    processing: state.postarea.processing,
    postingMode: state.settings.postingMode,
    logMode: Boolean(state.chat.logDate)
  };
}

const actions = {
  send: chat.send,
  exitLog: chat.exitLog,
  setMessage,
  snackbarOpen
};

export default connect(mapStateToProps, actions, null, { forwardRef: true })(Component);
