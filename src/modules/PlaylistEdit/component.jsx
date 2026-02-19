'use strict';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function PlaylistEdit({ id, artist, title, save, close }) {
  const [formArtist, setFormArtist] = useState(artist);
  const [formTitle, setFormTitle] = useState(title);

  useEffect(() => {
    setFormArtist(artist);
    setFormTitle(title);
  }, [id, artist, title]);

  if (!id) return null;

  const handleSubmit = () => {
    if (formArtist && formTitle) {
      save(id, formArtist, formTitle);
      close();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open onClose={close} maxWidth='xs' fullWidth>
      <DialogTitle>Редактировать трек</DialogTitle>
      <DialogContent>
        <TextField
          label='Исполнитель'
          value={formArtist}
          required
          onChange={e => setFormArtist(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Название'
          value={formTitle}
          required
          onChange={e => setFormTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' disabled={!formArtist || !formTitle} onClick={handleSubmit}>
          Сохранить
        </Button>
        <Button onClick={close}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
}
