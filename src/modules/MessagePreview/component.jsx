'use strict';

import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import Paper from '@mui/material/Paper';
import { Component as Message } from '../Message';

export default class MessagePreview extends Component {
  constructor(props) {
    super(props);
    this.nodeRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      document.addEventListener('mousemove', this.move);
    } else if (!this.props.visible && prevProps.visible) {
      document.removeEventListener('mousemove', this.move);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.move);
  }

  move = (event) => {
    const node = this.nodeRef.current;
    if (!node) return;
    const { clientX: x, clientY: y } = event;
    const cursorOffset = 20;
    const previewHeight = node.offsetHeight;
    const previewWidth = node.offsetWidth;
    const rightEdgeDistance = window.innerWidth - x - previewWidth - cursorOffset;
    const bottomEdgeDistance = window.innerHeight - y - previewHeight - cursorOffset;
    const leftPos = rightEdgeDistance <= 10 ? x - previewWidth - cursorOffset : x + cursorOffset;
    const topPos = bottomEdgeDistance <= 10 ? y - previewHeight - cursorOffset : y + cursorOffset;
    node.style.top = `${topPos}px`;
    node.style.left = `${leftPos}px`;
  };

  render() {
    const { message, visible, settings } = this.props;

    const placeholder = <div className='preview__placeholder'>Такого поста нет :3</div>;

    return (
      <CSSTransition
        in={visible}
        classNames='preview'
        timeout={{ enter: 250, exit: 250 }}
        unmountOnExit
        nodeRef={this.nodeRef}
      >
        <div className='preview' ref={this.nodeRef}>
          <Paper elevation={4} className='preview__paper'>
            {message === undefined ? placeholder : <Message message={message} settings={settings} />}
          </Paper>
        </div>
      </CSSTransition>
    );
  }
}
