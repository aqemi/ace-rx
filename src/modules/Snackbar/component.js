'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import MaterialSnackbar from 'material-ui/Snackbar';

export default function Snackbar(props) {
  return (
    <MaterialSnackbar
      autoHideDuration={10000}
      message={props.message}
      onRequestClose={props.snackbarClose}
      open={Boolean(props.message)}
      bodyStyle={{
        height: null,
        lineHeight: null,
        padding: '12px 24px',
        whiteSpace: 'pre-line'
      }}
    />
  );
}

Snackbar.propTypes = {
  message: PropTypes.string,
  snackbarClose: PropTypes.func.isRequired
};
