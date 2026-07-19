import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import * as api from './api';

const initialForm = {
  user: '',
  pass: ''
};

export default function AdminLogin(props) {
  const {
    isOpen, onClose, reloadAvatar, notify
  } = props;
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset the form each time the dialog is reopened.
  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setSubmitting(false);
      setError('');
    }
  }, [isOpen]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit = Boolean(form.user.trim() && form.pass) && !submitting;

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    setError('');
    api
      .login({ user: form.user.trim(), pass: form.pass })
      .then((message) => {
        if (message) {
          notify(message);
        }
        // Reload the avatar endpoint so `isAdmin` (and admin controls) update.
        reloadAvatar();
        setSubmitting(false);
        onClose();
      })
      .catch((err) => {
        setSubmitting(false);
        setError(err.message || 'Ошибка входа');
      });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='xs' className='admin-login'>
      <DialogTitle className='admin-login__title'>
        Вход администратора
        <IconButton onClick={onClose} className='admin-login__close'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className='admin-login__content'>
          <TextField
            autoFocus
            size='small'
            label='Логин'
            autoComplete='username'
            value={form.user}
            onChange={(e) => handleFormChange('user', e.target.value)}
            className='admin-login__field'
          />
          <TextField
            size='small'
            type='password'
            label='Пароль'
            autoComplete='current-password'
            value={form.pass}
            onChange={(e) => handleFormChange('pass', e.target.value)}
            error={Boolean(error)}
            helperText={error || ' '}
            className='admin-login__field'
          />
        </DialogContent>
        <DialogActions className='admin-login__actions'>
          <Button
            type='submit'
            variant='contained'
            disabled={!canSubmit}
            startIcon={submitting ? <CircularProgress size={16} color='inherit' /> : null}
          >
            Войти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
