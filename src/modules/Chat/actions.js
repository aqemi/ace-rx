'use strict';

import {
  CHAT_UPDATE,
  CHAT_START,
  CHAT_STOP,
  CHAT_EMPTY,
  CHAT_LOG,
  SET_ONLINE_COUNTER,
  POSTAREA_SET_UPLOADING,
  SNACKBAR_OPEN,
  IGNORE_ADD,
  IGNORE_CLEAR,
  IGNORE_LOAD
} from '../../actionTypes';

import * as api from './api';

export function update() {
  return (dispatch, getState) => {
    const lastMessageId = getState().chat.lastMessageId;

    return api.load(lastMessageId)
      .then(data => {
        const { data: messages } = data;

        if (messages && messages.length) {
          dispatch({
            type: CHAT_UPDATE,
            data: messages
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
    const timer = getState().chat.timer;
    clearInterval(timer);
    dispatch({ type: CHAT_STOP });
  };
}

export function send(message, file) {
  return (dispatch) => {
    if (!message && !file) return;

    if (file) {
      dispatch({ type: POSTAREA_SET_UPLOADING, data: true });
    }

    api.post(message, file)
      .then(response => {
        if (response) {
          let alert;
          try {
            const json = JSON.parse(response);
            alert = json.msg;
          } catch (e) {
            alert = response;
          }

          dispatch({
            type: SNACKBAR_OPEN,
            data: alert
          });
        }

        dispatch(update());

        if (file) {
          dispatch({ type: POSTAREA_SET_UPLOADING, data: false });
        }
      })
      .catch(err => {
        console.error(err);
        dispatch({
          type: SNACKBAR_OPEN,
          data: 'Проблемы с соединением'
        });
      });
  };
}

export function ignoreAdd(messageId) {
  return (dispatch, getState) => {
    const targetUserId = getState().chat.messages.find(msg => msg.id === messageId).user_id;

    dispatch({ type: IGNORE_ADD, data: targetUserId });

    const { ignoreList } = getState().chat;
    localStorage.setItem('ignoreList', JSON.stringify(ignoreList));
    dispatch({
      type: SNACKBAR_OPEN,
      data: `Автор поста #${messageId} добавлен в игнор`
    });
  };
}

export function ignoreClear() {
  localStorage.removeItem('ignoreList');
  return (dispatch) => {
    dispatch({ type: IGNORE_CLEAR });
    dispatch({
      type: SNACKBAR_OPEN,
      data: 'Игнор-лист очищен'
    });
  };
}

export function ignoreLoad() {
  const ignoreList = JSON.parse(localStorage.getItem('ignoreList'));
  return { type: IGNORE_LOAD, data: ignoreList };
}

export function control(method, messageId) {
  return (dispatch) => {
    api.control(method, messageId)
      .then(response => {
        dispatch({
          type: SNACKBAR_OPEN,
          data: response
        });
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
      .then(data => {
        dispatch({ type: CHAT_UPDATE, data });
      })
      .catch(console.error);
  };
}

export function exitLog() {
  return (dispatch) => {
    dispatch({ type: CHAT_EMPTY });
    dispatch(start());
    dispatch({ type: CHAT_LOG, data: null });
  };
}
