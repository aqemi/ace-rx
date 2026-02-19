'use strict';

import React, { Component, createRef } from 'react';
import { Component as Avatar } from '../Avatar';
import { Component as MessageMenu } from '../MessageMenu';
import { IconButton } from '@mui/material';

export default class MessageAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageMenu: false
    };
    this.avatarRef = createRef();
  }

  showMessageMenu() {
    this.setState({
      showMessageMenu: true
    });
  }

  hideMessageMenu() {
    this.setState({
      showMessageMenu: false
    });
  }

  render() {
    const { messageId, userId, avatar, hasAdminControls } = this.props;

    return (
      <React.Fragment>
        <IconButton
          size='small'
          disabled={this.props.logMode}
          className='message__avatar'
          onClick={(e) => {
            e.preventDefault();
            if (this.state.showMessageMenu || this.props.logMode) return;
            this.showMessageMenu();
          }}
        >
          <Avatar ref={this.avatarRef} userId={userId} bordered={!this.props.selected} image={avatar} />
        </IconButton>

        <MessageMenu
          open={this.state.showMessageMenu}
          anchorEl={this.avatarRef.current}
          hidePopover={this.hideMessageMenu.bind(this)}
          hasAdminControls={hasAdminControls}
          messageId={messageId}
          onControl={this.props.onControl}
          ignoreAdd={this.props.ignoreAdd}
          onReply={this.props.onReply}
        />
      </React.Fragment>
    );
  }
}
