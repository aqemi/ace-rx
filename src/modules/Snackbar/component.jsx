import React from 'react';
import MaterialSnackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

export default function Snackbar({
  message, actionType, actionLabel, onAction, snackbarClose
}) {
  const action = actionType && (
    <Button
      variant='contained'
      color='snackbarAction'
      size='small'
      onClick={() => onAction(actionType)}
    >
      {actionLabel}
    </Button>
  );

  return (
    <MaterialSnackbar
      autoHideDuration={10000}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      message={message}
      action={action}
      onClose={snackbarClose}
      open={Boolean(message)}
    />
  );
}
