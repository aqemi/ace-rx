'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Component as AttachmentImage } from '../AttachmentImage';
import { Component as AttachmentYoutube } from '../AttachmentYoutube';
import { Component as AttachmentWebm } from '../AttachmentWebm';
import {
  getExtWebmUrl
} from '../../utils';
import {
  getYoutubeId,
  getYoutubeTimestamp
} from '../../utils/youtube';

export default class Attachment extends Component {
  render() {
    const { message, settings } = this.props;
    const { text, picture } = message;

    const youtubeVideoId = getYoutubeId(text);
    const youtubeTimestamp = getYoutubeTimestamp(text);

    const extWebmUrl = getExtWebmUrl(message.text);


    let content = null;

    if (picture && settings.showImages) {
      content = <AttachmentImage picture={picture} />;
    } else if (youtubeVideoId && settings.showYoutube) {
      content = <AttachmentYoutube youtubeVideoId={youtubeVideoId} youtubeTimestamp={youtubeTimestamp} />;
    } else if (extWebmUrl && settings.showWebm) {
      content = <AttachmentWebm extWebmUrl={extWebmUrl} />;
    }

    if (content) {
      return <div className='attachment'>{content}</div>;
    }

    return null;
  }
}

Attachment.propTypes = {
  message: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};
