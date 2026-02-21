'use strict';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function BanDialog({ open, onClose, onSubmit }) {
  const [expires, setExpires] = useState(dayjs().add(1, 'day'));
  const [reason, setReason] = useState('');

  function handleSubmit() {
    onSubmit({
      expires: expires ? expires.toISOString() : null,
      reason
    });
  }

  function handleClose() {
    setExpires(dayjs().add(1, 'day'));
    setReason('');
    onClose();
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ban user</DialogTitle>
        <DialogContent className='ban-dialog__content'>
          <DatePicker
            label='Expires'
            value={expires}
            onChange={setExpires}
            disablePast
          />
          <TextField
            label='Reason'
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='error'>Ban</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
