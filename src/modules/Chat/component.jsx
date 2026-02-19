/* global window */

'use strict';

import React, { Component } from 'react';
import { Fab } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import { Component as Message } from '../Message';
import { Container as MessagePreview } from '../MessagePreview';
import { isMobile } from '../../utils';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.messageRefs = {};
    this.chatRef = React.createRef();
    this.state = {
      selectedMessageId: null,
      showScrollDownButton: false
    };
    this.autoscroll = true;
    this.inactive = false;
    this.defaultTitle = document.title;
    this.unreadPosts = 0;
    this.handleReply = this.handleReply.bind(this);
    this.gotoMessage = this.gotoMessage.bind(this);
  }

  handleReply(text) {
    this.props.insertReply(text);
    this.props.focusPostArea();
  }

  componentDidMount() {
    window.addEventListener('blur', () => (this.inactive = true));
    window.addEventListener('focus', () => {
      this.inactive = false;
      this.unreadPosts = 0;
      document.title = this.defaultTitle;
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.messages.length > prevProps.messages.length && !this.props.logMode) {
      if (this.inactive) {
        this.unreadPosts += this.props.messages.length - prevProps.messages.length;
        document.title = `[${this.unreadPosts}] ${this.defaultTitle}`;
      }
      if (this.autoscroll) {
        this.scrollToBottom();
      }
    }
  }

  onScroll() {
    if (this.props.logMode) return;
    const height = this.getScrollHeight() - this.getClientHeight();
    const diff = height - this.getScrollTop();
    this.autoscroll = (diff < 100);
    const showScrollDownButton = diff > 500;
    if (this.state.showScrollDownButton !== showScrollDownButton) {
      this.setState({ showScrollDownButton });
    }
  }

  getScrollHeight() {
    return this.chatRef.current?.scrollHeight ?? 0;
  }

  getClientHeight() {
    return this.chatRef.current?.clientHeight ?? 0;
  }

  getScrollTop() {
    return this.chatRef.current?.scrollTop ?? 0;
  }

  scrollTo(top) {
    if (this.chatRef.current) {
      this.chatRef.current.scrollTo({
        top,
      });
    }
  }

  scrollToBottom() {
    this.scrollTo(this.getScrollHeight());
  }

  gotoMessage(id) {
    const element = this.messageRefs[id].ref;
    const container = this.chatRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const elemTop = elementRect.top - containerRect.top;
    const elemBottom = elementRect.bottom - containerRect.top;
    const containerHeight = containerRect.height;

    const visible = (elemTop >= 0) && (elemBottom <= containerHeight);

    if (!visible) {
      const scrollTop = container.scrollTop + elemTop - 100;
      this.scrollTo(scrollTop);
    }
    this.setState({ selectedMessageId: id });
  }

  render() {
    const { messages, replies, logMode } = this.props;

    if (!messages.length) {
      return (
        <div className='chat'>
          <div className='chat__spinner'>
            <CircularProgress />
          </div>
        </div>
      );
    }

    const scrollDownButton = !this.state.showScrollDownButton ? null : (
      <Fab
        size='small'
        color='primary'
        className='chat__scroll-down'
        onClick={() => this.scrollToBottom()}
      >
        <KeyboardArrowDownIcon />
      </Fab>
    );

    return (
      <div className='chat' ref={this.chatRef} onScroll={() => this.onScroll()}>
        {
            messages.map(msg =>
              <Message
                message={msg}
                selected={this.state.selectedMessageId === msg.id}
                personal={msg.type === 'pvt'}
                key={msg.id}
                replies={replies[msg.id]}
                gotoMessage={this.gotoMessage}
                ref={(ref) => { this.messageRefs[msg.id] = ref; }}
                showPreview={this.props.showPreview}
                hidePreview={this.props.hidePreview}
                ignoreAdd={this.props.ignoreAdd}
                onControl={this.props.control}
                settings={this.props.settings}
                logMode={logMode}
                onReply={this.handleReply}
              />
            )
          }
        {scrollDownButton}
        {!isMobile() && <MessagePreview />}
      </div>
    );
  }
}
