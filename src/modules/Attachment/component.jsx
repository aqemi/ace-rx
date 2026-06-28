import React, { Component } from 'react';
import { Component as AttachmentImage } from '../AttachmentImage';
import { Component as AttachmentYoutube } from '../AttachmentYoutube';
import { Component as AttachmentWebm } from '../AttachmentWebm';
import { Component as AttachmentTelegram } from '../AttachmentTelegram';
import {
  getExtWebmUrl
} from '../../utils';
import {
  getYoutubeId,
  getYoutubeTimestamp
} from '../../utils/youtube';
import { TELEGRAM_REGEXP } from '../../constants';

export default class Attachment extends Component {
  render() {
    const { message, settings } = this.props;
    const { text, picture } = message;

    const youtubeVideoId = getYoutubeId(text);
    const youtubeTimestamp = getYoutubeTimestamp(text);

    const extWebmUrl = getExtWebmUrl(message.text);

    const telegramMatch = text.match(TELEGRAM_REGEXP);
    const telegramPost = telegramMatch && telegramMatch[1];

    let content = null;

    if (picture && settings.showImages) {
      content = <AttachmentImage picture={picture} />;
    } else if (youtubeVideoId && settings.showYoutube) {
      content = <AttachmentYoutube youtubeVideoId={youtubeVideoId} youtubeTimestamp={youtubeTimestamp} />;
    } else if (extWebmUrl && settings.showWebm) {
      content = <AttachmentWebm extWebmUrl={extWebmUrl} />;
    } else if (telegramPost && settings.showTelegram) {
      content = <AttachmentTelegram telegramPost={telegramPost} />;
    }

    if (content) {
      return content;
    }

    return null;
  }
}
