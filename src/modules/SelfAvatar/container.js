import { connect } from 'react-redux';
import Component from './component';
import * as actions from './actions';

function mapStateToProps(state) {
  return state.avatar;
}

export default connect(mapStateToProps, actions)(Component);
