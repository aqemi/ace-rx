import { connect } from 'react-redux';
import Component from './component';
import { snackbarClose } from './actions';

function mapStateToProps({ snackbar }) {
  return {
    message: snackbar?.message ?? null,
    actionType: snackbar?.actionType ?? null,
    actionLabel: snackbar?.actionLabel ?? null
  };
}

function mapDispatchToProps(dispatch) {
  return {
    snackbarClose: () => dispatch(snackbarClose()),
    onAction: (type) => dispatch({ type })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
