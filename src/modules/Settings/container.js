'use strict';

import { connect } from 'react-redux';
import Component from './component';
import * as actions from './actions';

function mapStateToProps(state) {
  return {
    isOpen: state.settings.isOpen,
    postingMode: state.settings.postingMode,
    showImages: state.settings.showImages,
    showYoutube: state.settings.showYoutube,
    showWebm: state.settings.showWebm,
    showReplies: state.settings.showReplies
  };
}

export default connect(mapStateToProps, actions)(Component);
