'use strict';

import {
  CHAT_UPDATE,
  CHAT_START,
  CHAT_STOP,
  SHOW_PREVIEW,
  MOVE_PREVIEW,
  HIDE_PREVIEW,
  SET_ONLINE_COUNTER,
  POSTAREA_SET_PROCESSING,
  SNACKBAR_OPEN
} from '../actionTypes';

import { load, post } from '../api/chat';

export function chatUpdate() {
  return (dispatch, getState) => {
    const lastMessageId = getState().chat.lastMessageId;
    return load(lastMessageId)
      .then(data => {
        const { data: messages } = data;
        dispatch({
          type: SET_ONLINE_COUNTER,
          data: {
            online: data.user_cnt,
            speed: data.speed
          }
        });
        if (messages && messages.length) {
          dispatch({
            type: CHAT_UPDATE,
            data: messages
          });
        }
      });
  };
}

export function chatStart() {
  return (dispatch) => {
    dispatch(chatUpdate());
    const timer = setInterval(() => {
      dispatch(chatUpdate());
    }, 7000);
    dispatch({
      type: CHAT_START,
      data: timer
    });
  };
}

export function chatStop() {
  return (dispatch, getState) => {
    const timer = getState().chat.timer;
    clearInterval(timer);
    dispatch({ type: CHAT_STOP });
  };
}

export function showPreview(id) {
  return (dispatch, getState) => {
    const message = getState().chat.messages.find(msg => msg.id === id);
    dispatch({
      type: SHOW_PREVIEW,
      data: message
    });
  };
}

export function movePreview(event) {
  return {
    type: MOVE_PREVIEW,
    data: event
  };
}

export function hidePreview() {
  return {
    type: HIDE_PREVIEW
  };
}

export function chatSend(message, file) {
  return (dispatch) => {
    if (!message && !file) return;

    dispatch({ type: POSTAREA_SET_PROCESSING, data: true });

    post(message, file)
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
        dispatch({ type: POSTAREA_SET_PROCESSING, data: false });
        chatUpdate();
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: SNACKBAR_OPEN,
          data: 'Проблемы с соединением'
        });
      });
  };
}
