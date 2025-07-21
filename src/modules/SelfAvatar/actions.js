'use strict';

import * as api from './api';

import { AVATAR_LOAD, AVATAR_SET_UPLOADING } from '../../actionTypes';

export function load() {
  return (dispatch) => {
    api
      .load()
      .then(data =>
        dispatch({
          type: AVATAR_LOAD,
          data
        })
      )
      .catch(console.error);
  };
}
const AVATAR_SIZE = 144;
export function upload(file) {
  return (dispatch) => {
    dispatch({ type: AVATAR_SET_UPLOADING, data: true });

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(image.width, image.height);
        const offsetX = (image.width - size) / 2;
        const offsetY = (image.height - size) / 2;

        const ctx = canvas.getContext('2d');
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        ctx.drawImage(image, offsetX, offsetY, size, size, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

        const dataurl = canvas.toDataURL(file.type);

        try {
          const avatarObj = await api.set(dataurl);
          localStorage.setItem('avatar', dataurl);
          dispatch({ type: AVATAR_LOAD, data: avatarObj });
        } catch (error) {
          console.error(error);
        }

        dispatch({ type: AVATAR_SET_UPLOADING, data: false });
      };

      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };
}

export function set(avatar) {
  return (dispatch) => {
    api
      .set(avatar)
      .then((data) => {
        if (data.avatar && data.userId) {
          dispatch({ type: AVATAR_LOAD, data });
        } else {
          load()(dispatch);
        }
      })
      .catch(console.error);
  };
}
