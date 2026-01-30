'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Paper from 'material-ui/Paper';
import { Component as Message } from '../Message';
import emitter from '../../emitter';

export default class MessagePreview extends Component {
  componentDidMount() {
    emitter.on('movePreview', this.move.bind(this));
  }

  componentWillUnmount() {
    emitter.removeAllListeners('movePreview');
  }

  move(x, y) {
    const cursorOffset = 20;
    const previewHeight = this.ref.offsetHeight;
    const previewWidth = this.ref.offsetWidth;
    const rightEdgeDistance = window.innerWidth - x - previewWidth - cursorOffset;
    const bottomEdgeDistance = window.innerHeight - y - previewHeight - cursorOffset;
    const leftPos = (rightEdgeDistance <= 10) ?
      x - previewWidth - cursorOffset :
      x + cursorOffset;
    const topPos = (bottomEdgeDistance <= 10) ?
      y - previewHeight - cursorOffset :
      y + cursorOffset;
    this.ref.style.top = `${topPos}px`;
    this.ref.style.left = `${leftPos}px`;
  }

  renderContent() {
    const { message, settings } = this.props;

    if (message === null) return null;

    const placeholder = (
      <div className='placeholder'>Такого поста нет :3</div>
    );

    return (
      <div
        className='preview'
        key='preview' // needed for animation
        ref={ref => (this.ref = ref)}
      >
        <Paper>{message === undefined ? placeholder : <Message message={message} settings={settings} />}</Paper>
      </div>
    );
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName='preview'
        transitionEnterTimeout={200}
        transitionLeaveTimeout={50}
      >
        {this.renderContent()}
      </ReactCSSTransitionGroup>
    );
  }
}

MessagePreview.propTypes = {
  message: PropTypes.object,
  settings: PropTypes.object.isRequired
};

