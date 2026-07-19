import {
  CHAT_UPDATE,
  CHAT_START,
  CHAT_STOP,
  CHAT_EMPTY,
  CHAT_LOG,
  SET_ONLINE_COUNTER,
  POSTAREA_SET_UPLOADING,
  POSTAREA_SET_MESSAGE,
  SNACKBAR_OPEN,
  IGNORE_ADD,
  IGNORE_CLEAR,
  IGNORE_LOAD
} from '../../actionTypes';

import * as api from './api';
import { getAvatar } from '../../utils/avatarStore';
import { close as closeLogPicker } from '../LogPicker/slice';

export function update() {
  return (dispatch, getState) => {
    const { lastMessageId } = getState().chat;

    return api.load(lastMessageId)
      .then((data) => {
        const { data: messages } = data;

        if (messages && messages.length) {
          dispatch({
            type: CHAT_UPDATE,
            data: messages
          });
        } else if (!getState().chat.loaded) {
          dispatch({
            type: CHAT_UPDATE,
            data: []
          });
        }

        dispatch({
          type: SET_ONLINE_COUNTER,
          data: data.user_cnt
        });
      })
      .catch(console.error);
  };
}

export function start() {
  return (dispatch) => {
    dispatch(update());

    const timer = setInterval(() => {
      dispatch(update());
    }, 7000);

    dispatch({
      type: CHAT_START,
      data: timer
    });
  };
}

export function stop() {
  return (dispatch, getState) => {
    const { timer } = getState().chat;
    clearInterval(timer);
    dispatch({ type: CHAT_STOP });
  };
}

export function send(message, file) {
  return async (dispatch) => {
    if (!message && !file) {
      return;
    }

    dispatch({ type: POSTAREA_SET_UPLOADING, data: true });

    let avatar = null;
    try {
      avatar = await getAvatar();
    } catch (error) {
      console.error(error);
    }

    let response;
    try {
      response = await api.post(message, file, avatar);
    } catch (error) {
      dispatch({ type: POSTAREA_SET_UPLOADING, data: false });
      // api.post rejects either from the Turnstile challenge (token minting) or
      // from the network; tell them apart for a useful message.
      const isTurnstile = /Turnstile/i.test(error?.message || '');
      dispatch({
        type: SNACKBAR_OPEN,
        data: isTurnstile ? 'Не удалось пройти проверку. Обновите страницу.' : 'Проблемы с соединением'
      });
      throw error;
    }

    if (response) {
      let alert;
      try {
        const json = JSON.parse(response);
        alert = json.msg;
      } catch {
        alert = response;
      }

      if (alert) {
        dispatch({ type: SNACKBAR_OPEN, data: alert });
        dispatch({ type: POSTAREA_SET_UPLOADING, data: false });
        throw new Error(alert);
      }
    }

    dispatch({ type: POSTAREA_SET_MESSAGE, data: '' });
    dispatch(update());
    dispatch({ type: POSTAREA_SET_UPLOADING, data: false });
  };
}

export function ignoreAdd(messageId) {
  return (dispatch, getState) => {
    const targetUserId = getState().chat.messages.find((msg) => msg.id === messageId).user_id;

    dispatch({ type: IGNORE_ADD, data: targetUserId });
    dispatch({
      type: SNACKBAR_OPEN,
      data: {
        message: `Автор поста #${messageId} добавлен в игнор`,
        actionType: IGNORE_CLEAR,
        actionLabel: 'Очистить игнор'
      }
    });
  };
}

export function ignoreClear() {
  // Persistence + the confirmation toast are handled by the ignore middleware.
  return { type: IGNORE_CLEAR };
}

export function ignoreLoad() {
  const ignoreList = JSON.parse(localStorage.getItem('ignoreList'));
  return { type: IGNORE_LOAD, data: ignoreList };
}

export function control(method, messageId, params) {
  return (dispatch) => {
    api.control(method, messageId, params)
      .then((response) => {
        if (response) {
          dispatch({
            type: SNACKBAR_OPEN,
            data: response
          });
        }
      })
      .catch(console.log);
  };
}

export function loadLog(date) {
  return (dispatch) => {
    dispatch(stop());
    dispatch({ type: CHAT_EMPTY });
    dispatch({ type: CHAT_LOG, data: date });

    api.loadLog(date)
      .then((response) => {
        let data;
        try {
          data = JSON.parse(response);
        } catch {
          data = response;
        }

        if (Array.isArray(data)) {
          dispatch({ type: CHAT_UPDATE, data });
        } else {
          dispatch({ type: SNACKBAR_OPEN, data: data.msg || data });
        }
      })
      .catch(console.error);
  };
}

export function exitLog() {
  return (dispatch) => {
    dispatch({ type: CHAT_EMPTY });
    dispatch(start());
    dispatch({ type: CHAT_LOG, data: null });
    dispatch(closeLogPicker());
  };
}
