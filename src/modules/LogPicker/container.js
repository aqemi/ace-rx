'use strict';

import { connect } from 'react-redux';
import Component from './component';
import { actions as chatActions } from '../Chat';
import { close } from './slice';

function mapStateToProps(state) {
  return { isOpen: state.logPicker.isOpen };
}

export default connect(mapStateToProps, {
  load: chatActions.loadLog,
  close
})(Component);
