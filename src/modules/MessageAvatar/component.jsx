'use strict';

import React, { Component, createRef } from 'react';
import clsx from 'clsx';
import { IconButton } from '@mui/material';
import { Component as Avatar } from '../Avatar';
import { Component as MessageMenu } from '../MessageMenu';
import { getAvatarColor, getShiftedAvatarColor } from '../../utils';

export default class MessageAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageMenu: false,
    };
    this.avatarRef = createRef();
  }

  showMessageMenu() {
    this.setState({
      showMessageMenu: true,
    });
  }

  hideMessageMenu() {
    this.setState({
      showMessageMenu: false,
    });
  }

  render() {
    const { messageId, userId, avatar, hasAdminControls, selected } = this.props;

    const userColor = userId ? getAvatarColor(userId) : null;
    const userColorShifted = userColor ? getShiftedAvatarColor(userId, 60) : null;
    const userBorder = `linear-gradient(135deg, ${userColor} 0%, ${userColor} 100%)`;

    return (
      <React.Fragment>
        <IconButton
          size="small"
          disabled={this.props.logMode}
          className="message__avatar"
          onClick={(e) => {
            e.preventDefault();
            if (this.state.showMessageMenu || this.props.logMode) return;
            this.showMessageMenu();
          }}
        >
          <div
            className={clsx({
              'avatar__border-gradient': true,
              'avatar__border-gradient--active': !selected,
            })}
            style={{ background: !selected && userBorder }}
          >
            <div className="avatar__border-gap">
              <Avatar ref={this.avatarRef} userId={userId} image={avatar} />
            </div>
          </div>
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
