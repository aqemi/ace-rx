'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default function Feed(props) {
  return (
    <div className='feed'>
      <Scrollbars autoHide>
        <ReactCSSTransitionGroup
          transitionName='feed'
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={2000}
        >
          {props.children}
        </ReactCSSTransitionGroup>
      </Scrollbars>
    </div>
  );
}

Feed.propTypes = {
  children: PropTypes.node
};
