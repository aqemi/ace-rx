'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import './style/index.less';
import store from './store';
import { Component as Main } from './modules/Main';
import { actions as chat } from './modules/Chat';
import { actions as playlist } from './modules/Playlist';
import { actions as header } from './modules/RightHeader';
import { actions as avatar } from './modules/SelfAvatar';
import { actions as settings } from './modules/Settings';

const rootElement = document.getElementById('application');
const root = ReactDOM.createRoot(rootElement);

store.dispatch(header.loadTopic());
store.dispatch(chat.ignoreLoad());
store.dispatch(chat.start());
store.dispatch(playlist.start());
if (localStorage.avatar) {
  store.dispatch(avatar.set(localStorage.avatar));
} else {
  store.dispatch(avatar.load());
}
store.dispatch(settings.load());

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <Main />
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
