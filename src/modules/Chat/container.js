import { connect } from 'react-redux';
import Component from './component';
import * as chatActions from './actions';
import { actions as previewActions } from '../MessagePreview';
import * as postAreaActions from '../PostArea/actions';

function mapStateToProps(state) {
  return {
    messages: state.chat.messages,
    loaded: state.chat.loaded,
    replies: state.chat.replies,
    logMode: Boolean(state.chat.logDate),
    settings: state.settings
  };
}

const actions = { ...chatActions, ...previewActions, insertReply: postAreaActions.insertReply };

export default connect(mapStateToProps, actions, null, { forwardRef: true })(Component);
