'use strict';

import {
  PLAYLIST_UPDATE,
  PLAYLIST_SELECT,
  PLAYLIST_DESELECT,
  PLAYLIST_PREVIOUS,
  PLAYLIST_NEXT,
  PLAYLIST_UPLOAD_PROGRESS,
  PLAYLIST_TOGGLE_SHUFFLE,
  PLAYLIST_CYCLE_REPEAT
} from '../../actionTypes';

import { updateState, getRandomIndex } from '../../utils';

const repeatCycle = { off: 'one', all: 'off', one: 'all' };

const initialState = {
  items: [],
  selected: null,
  uploadProgress: null,
  shuffle: localStorage.getItem('shuffle') === 'true',
  repeat: localStorage.getItem('repeat') || 'off'
};

export default function (state = initialState, action) {
  const { data, type } = action;

  switch (type) {
    case PLAYLIST_UPDATE:
      return updateState(state, {
        items: data
      });
    case PLAYLIST_SELECT:
      return updateState(state, {
        selected: data
      });
    case PLAYLIST_DESELECT:
      return updateState(state, {
        selected: null
      });
    case PLAYLIST_PREVIOUS: {
      const i = state.items.findIndex(item => item.id === state.selected);
      if (state.shuffle) {
        const r = getRandomIndex(state.items.length, i);
        return updateState(state, { selected: state.items[r].id });
      }
      if (i === 0) {
        if (state.repeat === 'all') {
          return updateState(state, { selected: state.items[state.items.length - 1].id });
        }
        return state;
      }
      return updateState(state, { selected: state.items[i - 1].id });
    }
    case PLAYLIST_NEXT: {
      const i = state.items.findIndex(item => item.id === state.selected);
      if (state.repeat === 'one') {
        // re-select same track; Player component handles replay
        return updateState(state, { selected: state.selected });
      }
      if (state.shuffle) {
        const r = getRandomIndex(state.items.length, i);
        return updateState(state, { selected: state.items[r].id });
      }
      if (i === state.items.length - 1) {
        if (state.repeat === 'all') {
          return updateState(state, { selected: state.items[0].id });
        }
        return state;
      }
      return updateState(state, { selected: state.items[i + 1].id });
    }
    case PLAYLIST_TOGGLE_SHUFFLE: {
      const shuffle = !state.shuffle;
      localStorage.setItem('shuffle', shuffle);
      return updateState(state, { shuffle });
    }
    case PLAYLIST_CYCLE_REPEAT: {
      const repeat = repeatCycle[state.repeat] || 'off';
      localStorage.setItem('repeat', repeat);
      return updateState(state, { repeat });
    }
    case PLAYLIST_UPLOAD_PROGRESS:
      return updateState(state, {
        uploadProgress: data
      });
    default:
      return state;
  }
}
