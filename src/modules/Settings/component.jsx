'use strict';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import { useColorScheme } from '@mui/material/styles';

export default function Settings(props) {
  const { mode, setMode } = useColorScheme();

  return (
    <Dialog open={props.isOpen} onClose={props.close} maxWidth='sm' fullWidth className='settings'>
      <DialogTitle>Настройки</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={(event) => {
                setMode(event.target.checked ? 'dark' : 'light');
              }}
            />
          }
          label='Темный фон'
        />

        <Divider />

        <RadioGroup
          name='postingMode'
          value={props.postingMode}
          onChange={event => props.set('postingMode', event.target.value)}
        >
          <FormControlLabel
            value='inverse'
            control={<Radio />}
            label={
              <div>
                <b>Enter</b> - Отправка сообщения, <b>Shift + Enter</b> - Перенос строки
              </div>
            }
          />
          <FormControlLabel
            value='natural'
            control={<Radio />}
            label={
              <div>
                <b>Ctrl + Enter</b> - Отправка сообщения, <b>Enter</b> - Перенос строки
              </div>
            }
          />
        </RadioGroup>

        <Divider />

        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.showImages}
                onChange={event => props.set('showImages', event.target.checked)}
              />
            }
            label='Картинки'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.showYoutube}
                onChange={event => props.set('showYoutube', event.target.checked)}
              />
            }
            label='Youtube'
          />
          <FormControlLabel
            control={
              <Checkbox checked={props.showWebm} onChange={event => props.set('showWebm', event.target.checked)} />
            }
            label='Webm'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.showReplies}
                onChange={event => props.set('showReplies', event.target.checked)}
              />
            }
            label='Ответы'
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close} color='primary'>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
