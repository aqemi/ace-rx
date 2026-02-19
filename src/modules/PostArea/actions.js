'use strict';

import {
  POSTAREA_SET_MESSAGE,
  POSTAREA_INSERT_REPLY
} from '../../actionTypes';

export function setMessage(message) {
  return {
    type: POSTAREA_SET_MESSAGE,
    data: message
  };
}

export function insertReply(reply) {
  return {
    type: POSTAREA_INSERT_REPLY,
    data: reply
  };
}
