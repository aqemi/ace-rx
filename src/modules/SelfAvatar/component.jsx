import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Component as Avatar } from '../Avatar';

const EDITOR_SIZE = 256;

export default function SelfAvatar(props) {
  const editorRef = useRef(null);
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(1);

  const onSelect = (event) => {
    const selected = event.target.files[0];
    event.target.value = '';
    if (selected) {
      setFile(selected);
      setScale(1);
    }
  };

  const close = () => setFile(null);

  const save = () => {
    editorRef.current.getImageScaledToCanvas().toBlob((blob) => {
      if (blob) {
        props.set(blob);
      }
      close();
    }, 'image/png');
  };

  return (
    <>
      <IconButton component='label' size='small' className={props.className}>
        {props.loading
          ? <Skeleton variant='circular' animation='wave' className='self-avatar__skeleton' />
          : <Avatar image={props.image} userId={props.userId} />}
        {props.uploading && (
          <IconButton
            component='span'
            className='self-avatar__spinner'
            variant='overlay'
            loading
            loadingIndicator={<CircularProgress color='inherit' size={24} />}
          />
        )}
        <input type='file' accept='image/*' onChange={onSelect} />
      </IconButton>

      <Dialog open={Boolean(file)} onClose={close} className='avatar-editor'>
        <DialogTitle>Аватар</DialogTitle>
        <DialogContent className='avatar-editor__content'>
          {file && (
            <AvatarEditor
              ref={editorRef}
              image={file}
              width={EDITOR_SIZE}
              height={EDITOR_SIZE}
              border={24}
              borderRadius={EDITOR_SIZE / 2}
              color={[0, 0, 0, 0.6]}
              scale={scale}
            />
          )}
          <Slider
            className='avatar-editor__zoom'
            min={1}
            max={3}
            step={0.01}
            value={scale}
            onChange={(event, value) => setScale(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color='primary'>
            Отмена
          </Button>
          <Button onClick={save} color='primary' variant='contained'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
