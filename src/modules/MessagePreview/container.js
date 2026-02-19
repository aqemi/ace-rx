'use strict';

import { connect } from 'react-redux';
import Component from './component';

function mapStateToProps(state) {
  const { messageId, visible } = state.preview;

  let message = null;
  if (messageId !== null) {
    message = state.chat.messages.find(msg => msg.id === messageId);
  }

  return { message, visible, settings: state.settings };
}

export default connect(mapStateToProps)(Component);

