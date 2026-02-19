'use strict';

import React from 'react';
import MaterialSnackbar from '@mui/material/Snackbar';

export default function Snackbar(props) {
  return (
    <MaterialSnackbar
      autoHideDuration={10000}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      message={props.message}
      onClose={props.snackbarClose}
      open={Boolean(props.message)}
    />
  );
}
