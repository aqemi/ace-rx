import { YOUTUBE_REGEXP } from '../constants';

export function isYoutube(text) {
  return YOUTUBE_REGEXP.test(text);
}

export function getYoutubeId(text) {
  const match = text.match(YOUTUBE_REGEXP);
  return match && match[1];
}

export function getYoutubeTimestamp(text) {
  const match = text.match(YOUTUBE_REGEXP);
  return match && match[2];
}

export function getYoutubeThumbnail(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYoutubeTitle(videoId) {
  // eslint-disable-next-line max-len
  return fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${import.meta.env.VITE_YT_API_KEY}`)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from youtube api');
      }
      return response.json();
    })
    .then((data) => data.items[0].snippet.title);
}
