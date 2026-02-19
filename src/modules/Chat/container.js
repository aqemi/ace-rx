'use strict';

import { connect } from 'react-redux';
import Component from './component';
import * as chatActions from './actions';
import { actions as previewActions } from '../MessagePreview';
import { actions as postAreaActions } from '../PostArea';

function mapStateToProps(state) {
  return {
    messages: state.chat.messages,
    replies: state.chat.replies,
    logMode: Boolean(state.chat.logDate),
    settings: state.settings
  };
}

const actions = Object.assign({}, chatActions, previewActions, {
  insertReply: postAreaActions.insertReply
});

export default connect(mapStateToProps, actions)(Component);
