'use strict';

import { connect } from 'react-redux';
import Component from './component';
import * as actions from './actions';

function mapStateToProps(state) {
  return {
    image: state.lightbox.image,
    video: state.lightbox.video
  };
}

export default connect(mapStateToProps, actions)(Component);
