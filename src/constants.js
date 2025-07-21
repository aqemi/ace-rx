'use strict';

export const LINK_REGEXP = /(https?:\/\/\S+)/g;
export const REPLY_REGEXP = /@([0-9]+)/g;
export const PRIVATE_REGEXP = /!#([0-9]+)/g;
export const MARKUP_STRONG_REGEXP = /\*\*(.+?)\*\*/g;
export const MARKUP_EMPH_REGEXP = /\*(.+?)\*/g;
export const MARKUP_STRIKE_REGEXP = /\[s\](.+?)\[\/s\]/g;
export const MARKUP_SPOILER_REGEXP = /%%(.+?)%%/g;
export const MARKUP_QUOTE_REGEXP = /(>.+|&gt;.+)/gm;
export const MARKUP_ADM_REGEXP = /(\$ADM\$)/g;
export const MARKUP_MOD_REGEXP = /(\$MOD\$)/g;
export const YOUTUBE_REGEXP = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})(?:(?:.+?)t=(\d+))?/; //eslint-disable-line
export const YOUTUBE_REPLACE_REGEXP = /((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)(?:[a-zA-Z0-9_-]{6,11})(?:(?:.+?)t=(?:\d+))?)\S*/; //eslint-disable-line
export const EXT_WEBM_REGEXP = /https?:\/\/2ch.+?\.(?:webm|mp4)/;
