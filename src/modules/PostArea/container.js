'use strict';

import { connect } from 'react-redux';
import Component from './component';
import { actions as chat } from '../Chat';
import { setMessage } from './actions';

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
  setMessage
};

export default connect(mapStateToProps, actions, null, { forwardRef: true })(Component);
