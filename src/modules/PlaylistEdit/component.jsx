'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class PlaylistEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: '',
      title: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      artist: nextProps.artist,
      title: nextProps.title
    });
  }

  render() {
    const { id } = this.props;

    if (!id) return null;

    const actions = [
      <FlatButton
        label='Сохранить'
        primary
        disabled={!this.state.artist || !this.state.title}
        onTouchTap={() => {
          this.props.save(id, this.state.artist, this.state.title);
          this.props.close();
        }}
      />,
      <FlatButton
        label='Отмена'
        onTouchTap={this.props.close}
      />
    ];

    return (
      <Dialog
        open
        onRequestClose={this.props.close}
        actions={actions}
        title='Редактировать трек'
        contentStyle={{
          width: 400
        }}
        titleStyle={{
          backgroundColor: this.context.muiTheme.appBar.color,
          color: this.context.muiTheme.appBar.textColor,
          padding: '10px 20px',
          fontSize: 16
        }}
      >
        <TextField
          floatingLabelText='Исполнитель'
          value={this.state.artist}
          required
          onChange={e => this.setState({ artist: e.target.value })}
          fullWidth
        />
        <TextField
          floatingLabelText='Название'
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
          fullWidth
        />
      </Dialog>
    );
  }
}

PlaylistEdit.propTypes = {
  id: PropTypes.string,
  artist: PropTypes.string,
  title: PropTypes.string,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

PlaylistEdit.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
