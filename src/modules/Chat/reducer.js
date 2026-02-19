'use strict';

import { updateState, union, unionBy } from '../../utils';
import {
  CHAT_UPDATE,
  CHAT_START,
  CHAT_STOP,
  CHAT_EMPTY,
  CHAT_LOG,
  IGNORE_ADD,
  IGNORE_CLEAR,
  IGNORE_LOAD
} from '../../actionTypes';

import { REPLY_REGEXP } from '../../constants';

const initialState = {
  messages: [],
  lastMessageId: 0,
  timer: null,
  replies: {},
  ignoreList: [],
  logDate: null
};

export default function (state = initialState, action) {
  const { data, type } = action;

  switch (type) {
    case CHAT_UPDATE: {
      const lastMessage = data.slice(-1).pop();

      const deleteIds = new Set(data.filter(msg => msg.type === 'dlt').map(msg => msg.text));
      // Filter ignored, system, and deleted messages
      const messages = data.filter(
        msg => msg.type !== 'dlt' && !deleteIds.has(msg.id) && !state.ignoreList.includes(msg.user_id),
      );

      // Genetare "answers"
      const replies = messages.reduce((acc, message) => {
        const targetId = message.id;
        const matches = message.text.match(REPLY_REGEXP) || [];

        matches.slice(0, 6).forEach((match) => {
          const sourceId = match.replace('@', '');
          // merge existing replies, replies parsed in previous iteration and just parsed reply
          acc[sourceId] = union(state.replies[sourceId], acc[sourceId], [targetId]);
        });

        return acc;
      }, {});

      return updateState(state, {
        lastMessageId: lastMessage ? Number(lastMessage.id) : state.lastMessageId,
        messages: unionBy(state.messages, messages, 'id').filter(m => !deleteIds.has(m.id)),
        replies: updateState(state.replies, replies)
      });
    }

    case CHAT_START:
      return updateState(state, {
        timer: data
      });

    case CHAT_STOP:
      return updateState(state, {
        timer: null
      });

    case CHAT_EMPTY:
      return updateState(state, {
        messages: [],
        lastMessageId: 0
      });

    case IGNORE_ADD: {
      const targetUserId = data;
      return updateState(state, {
        messages: state.messages.filter(msg => msg.user_id !== targetUserId),
        ignoreList: [...state.ignoreList, targetUserId]
      });
    }

    case IGNORE_CLEAR:
      return updateState(state, {
        ignoreList: []
      });

    case IGNORE_LOAD:
      return updateState(state, {
        ignoreList: data || []
      });

    case CHAT_LOG:
      return updateState(state, {
        logDate: data
      });

    default:
      return state;
  }
}
