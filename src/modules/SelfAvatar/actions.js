import * as api from './api';
import { getAvatar, setAvatar } from '../../utils/avatarStore';

import { AVATAR_LOAD, AVATAR_SET_UPLOADING } from '../../actionTypes';

let objectUrl = null;

function toObjectUrl(blob) {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
  objectUrl = URL.createObjectURL(blob);
  return objectUrl;
}

export function load() {
  return async (dispatch) => {
    try {
      const [blob, data] = await Promise.all([getAvatar(), api.load()]);
      dispatch({
        type: AVATAR_LOAD,
        data: { userId: data.userId, avatar: blob ? toObjectUrl(blob) : null }
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function set(avatar) {
  return async (dispatch) => {
    dispatch({ type: AVATAR_SET_UPLOADING, data: true });
    try {
      await setAvatar(avatar);
      dispatch({ type: AVATAR_LOAD, data: { avatar: toObjectUrl(avatar) } });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: AVATAR_SET_UPLOADING, data: false });
    }
  };
}
