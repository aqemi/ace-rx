'use strict';

import Component from './component';
import Container from './container';
import reducer, { open, close } from './slice';
import './style.less';

const actions = { open, close };

export {
  Component,
  Container,
  reducer,
  actions
};
