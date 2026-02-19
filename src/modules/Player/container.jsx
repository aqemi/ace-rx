'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { useColorScheme } from '@mui/material/styles';
import Component from './component';
import { actions } from '../Playlist';

function mapStateToProps(state) {
  return {
    track: state.playlist.items.find(track => track.id === state.playlist.selected),
    shuffle: state.playlist.shuffle,
    repeat: state.playlist.repeat
  };
}

const Connected = connect(mapStateToProps, actions)(Component);

export default function Player(props) {
  const { mode } = useColorScheme();

  return <Connected {...props} mode={mode} />;
}
