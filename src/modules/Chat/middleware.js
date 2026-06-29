import { createListenerMiddleware } from '@reduxjs/toolkit';
import { IGNORE_ADD, IGNORE_CLEAR, SNACKBAR_OPEN } from '../../actionTypes';

// Side effects of ignore-list actions: persist to localStorage, and confirm a
// clear with a toast — so the menu and the snackbar action behave identically.
const listener = createListenerMiddleware();

listener.startListening({
  predicate: (action) => action.type === IGNORE_ADD || action.type === IGNORE_CLEAR,
  effect: (action, api) => {
    // Runs after the reducer, so the state is already updated.
    const { ignoreList } = api.getState().chat;
    localStorage.setItem('ignoreList', JSON.stringify(ignoreList));

    if (action.type === IGNORE_CLEAR) {
      api.dispatch({ type: SNACKBAR_OPEN, data: 'Игнор-лист очищен' });
    }
  }
});

export default listener.middleware;
