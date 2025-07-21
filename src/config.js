'use strict';

const { API_URL } = process.env;
export const CHAT_ENDPOINT = `${API_URL}/?app=chat`;
export const PLAYLIST_ENDPOINT = `${API_URL}/?app=playlist`;
export const TOPIC_ENDPOINT = `${API_URL}/?app=topic`;
export const CONTROL_ENDPOINT = `${API_URL}/?app=admin`;
export const AVATAR_ENDPOINT = `${API_URL}/?app=avatar`;
export const LOG_ENDPOINT = `${API_URL}/?app=logs`;
