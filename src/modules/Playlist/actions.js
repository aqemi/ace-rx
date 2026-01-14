'use strict';

import * as api from './api';
import {
  PLAYLIST_UPDATE,
  PLAYLIST_SELECT,
  PLAYLIST_DESELECT,
  PLAYLIST_PREVIOUS,
  PLAYLIST_NEXT,
  PLAYLIST_UPLOAD_PROGRESS,
  SNACKBAR_OPEN
} from '../../actionTypes';

let timer;

export function update() {
  return (dispatch) => {
    api.load()
      .then(data => dispatch({ type: PLAYLIST_UPDATE, data: data.songs }))
      .catch(console.error);
  };
}

export function start() {
  return (dispatch) => {
    dispatch(update());
    timer = setInterval(() => {
      dispatch(update());
    }, 20000);
  };
}

export function stop() {
  clearInterval(timer);
  return { type: null };
}

export function select(id) {
  return {
    type: PLAYLIST_SELECT,
    data: id
  };
}

export function deselect() {
  return { type: PLAYLIST_DESELECT };
}

export function previous() {
  return { type: PLAYLIST_PREVIOUS };
}

export function next() {
  return { type: PLAYLIST_NEXT };
}

export function upload(file) {
  return (dispatch) => {
    const onProgress = (e) => {
      const progress = (e.loaded / e.total) * 100;
      dispatch({ type: PLAYLIST_UPLOAD_PROGRESS, data: progress });
    };
    api.upload(file, onProgress)
      .then((response) => {
        let alert;
        try {
          const json = JSON.parse(response);
          alert = json.msg;
        } catch (e) {
          alert = response;
        }
        dispatch({ type: PLAYLIST_UPLOAD_PROGRESS, data: null });
        dispatch({ type: SNACKBAR_OPEN, data: alert });
        dispatch(update());
      })
      .catch(console.error);
  };
}

export function vote(id, value) {
  return (dispatch) => {
    api.vote(id, value)
      .then((response) => {
        if (response) {
          let alert;
          try {
            const json = JSON.parse(response);
            alert = json.msg;
          } catch (e) {
            alert = response;
          }
          dispatch({ type: SNACKBAR_OPEN, data: alert });
        }
        dispatch(update());
      })
      .catch(console.error);
  };
}

export function edit(id, artist, title) {
  return (dispatch) => {
    api.edit(id, artist, title)
      .then((response) => {
        console.info(response);
        dispatch(update());
      })
      .catch(console.error);
  };
}

export function deleteSong(id) {
  return (dispatch) => {
    api.deleteSong(id)
      .then((response) => {
        let alert;
        try {
          const json = JSON.parse(response);
          alert = json.msg;
        } catch (e) {
          alert = response;
        }
        if (alert) {
          dispatch({ type: SNACKBAR_OPEN, data: alert });
        }
        dispatch(update());
      })
      .catch(console.error);
  };
}

export { deleteSong as delete };
