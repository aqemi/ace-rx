'use strict';

import React, { Component } from 'react';
import clsx from 'clsx';
import {
  padTime
} from '../../utils';
import * as parser from '../../utils/messageParser';
import {
  isYoutube,
  getYoutubeId,
  getYoutubeTitle
} from '../../utils/youtube';
import { Component as MessageAvatar } from '../MessageAvatar';
import { Component as Attachment } from '../Attachment';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedText: false,
      showReadMore: false,
      youtubeTitle: null
    };
    this.isYoutube = false;
  }

  componentDidMount() {
    if (this.messageTextRef.scrollHeight > this.messageTextRef.clientHeight) {
      this.setState({
        showReadMore: true
      });
    }

    if (this.isYoutube) {
      getYoutubeTitle(this.youtubeVideoId)
        .then(title => this.setState({ youtubeTitle: title }));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props } = this;
    return (
      this.state !== nextState ||
      props.selected !== nextProps.selected ||
      props.settings.showImages !== nextProps.settings.showImages ||
      props.settings.showYoutube !== nextProps.settings.showYoutube ||
      props.settings.showWebm !== nextProps.settings.showWebm ||
      (props.replies && props.replies.length) !== (nextProps.replies && nextProps.replies.length) ||
      props.message.id !== nextProps.message?.id // for preview message
    );
  }

  toggleExpandText() {
    this.setState({
      expandedText: !this.state.expandedText
    });
  }

  reply(id, isPrivate) {
    if (this.props.logMode || !this.props.onReply) return;
    const replyStr = isPrivate ? `!#${id}` : `@${id}`;
    this.props.onReply(replyStr);
  }

  render() {
    const { message, replies, selected, personal } = this.props;
    let { text } = message;
    const { id, picture } = message;

    const time = new Date(message.time);
    const formattedTime = `${padTime(time.getHours())}:${padTime(time.getMinutes())}:${padTime(time.getSeconds())}`;

    this.isYoutube = isYoutube(text) && !picture;
    this.youtubeVideoId = getYoutubeId(text);

    const readMoreBlock = !this.state.showReadMore ? null : (
      <a href='' className='message__read-more' onClick={(e) => { e.preventDefault(); this.toggleExpandText(); }} >
        {this.state.expandedText ? 'Скрыть' : 'Читать полностью'}
      </a>
    );

    const repliesBlock = !replies ? null : (
      <div className='message__replies'>
        Ответы:{
          replies.map(reply =>
            <a
              href=''
              key={reply}
              onClick={(e) => { e.preventDefault(); this.props.gotoMessage(reply); }}
              onMouseEnter={() => this.props.showPreview(reply)}
              onMouseLeave={() => this.props.hidePreview()}
            >
              {'>>'}{reply}
            </a>
          )
        }
      </div>
    );

    text = parser.parseMarkup(text);
    text = parser.parseReplies(
      text,
      this.props.gotoMessage,
      this.props.showPreview,
      this.props.hidePreview
    );
    if (this.state.youtubeTitle) {
      text = parser.replaceYoutubeLink(text, this.state.youtubeTitle);
    }
    text = parser.parseLinks(text);

    return (
      <div className={clsx('message', { 'message--selected': selected, 'message--personal': personal })} ref={ref => (this.ref = ref)}>
        <MessageAvatar
          logMode={this.props.logMode}
          messageId={message.id}
          userId={message.user_id}
          avatar={message.avatar}
          hasAdminControls={message.controls}
          selected={selected}
          onControl={this.props.onControl}
          ignoreAdd={this.props.ignoreAdd}
          onReply={this.props.onReply}
        />

        <div className='message__time'>{formattedTime}</div>

        <div className='message__id-wrapper'>
          <span
            className='message__id'
            onClick={() => this.reply(id, personal)}
          >
            #{id}
          </span>
          {personal ? <span className='message__personal-flag'> [Личное сообщение]</span> : null}
        </div>

        <div
          className='message__text'
          ref={ref => (this.messageTextRef = ref)}
          style={{
            maxHeight: this.state.expandedText ? 'none' : null
          }}
        >
          {text}
        </div>

        {readMoreBlock}

        <Attachment message={message} settings={this.props.settings} />

        {repliesBlock}
      </div>
    );
  }
}
