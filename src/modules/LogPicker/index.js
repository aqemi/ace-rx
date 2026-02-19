'use strict';

import Component from './component';
import Container from './container';
import reducer, { open, close } from './slice';

const actions = { open, close };

export {
  Component,
  Container,
  reducer,
  actions
};
