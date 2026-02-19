'use strict';

import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { reducer as chat } from './modules/Chat';
import { reducer as playlist } from './modules/Playlist';
import { reducer as postarea } from './modules/PostArea';
import { reducer as snackbar } from './modules/Snackbar';
import { reducer as preview } from './modules/MessagePreview';
import { reducer as info } from './modules/RightHeader';
import { reducer as avatar } from './modules/SelfAvatar';
import { reducer as lightbox } from './modules/Lightbox';
import { reducer as settings } from './modules/Settings';
import { reducer as logPicker } from './modules/LogPicker';

const logger = createLogger();

const store = configureStore({
  reducer: {
    chat,
    playlist,
    postarea,
    snackbar,
    preview,
    info,
    avatar,
    lightbox,
    settings,
    logPicker
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});

export default store;
