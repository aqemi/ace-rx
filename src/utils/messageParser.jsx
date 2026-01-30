'use strict';

import React from 'react';
import replacer from 'react-string-replace';
import {
  LINK_REGEXP,
  REPLY_REGEXP,
  MARKUP_STRONG_REGEXP,
  MARKUP_EMPH_REGEXP,
  MARKUP_STRIKE_REGEXP,
  MARKUP_SPOILER_REGEXP,
  MARKUP_QUOTE_REGEXP,
  MARKUP_ADM_REGEXP,
  MARKUP_MOD_REGEXP,
  YOUTUBE_REPLACE_REGEXP,
  PRIVATE_REGEXP
} from '../constants';

export function parseMarkup(text) {
  let replaced = replacer(text, MARKUP_QUOTE_REGEXP, (match, i) => (
    <span className='quote' key={`quote${i}`}>{match}</span>
  ));
  replaced = replacer(replaced, MARKUP_STRONG_REGEXP, (match, i) => (
    <span className='strong' key={`strong${i}`}>{match}</span>
  ));
  replaced = replacer(replaced, MARKUP_EMPH_REGEXP, (match, i) => (
    <span className='emph' key={`emph${i}`}>{match}</span>
  ));
  replaced = replacer(replaced, MARKUP_SPOILER_REGEXP, (match, i) => (
    <span className='spoiler' key={`spoiler${i}`}>{match}</span>
  ));
  replaced = replacer(replaced, MARKUP_STRIKE_REGEXP, (match, i) => (
    <span className='strike' key={`strike${i}`}>{match}</span>
  ));
  replaced = replacer(replaced, MARKUP_ADM_REGEXP, (match, i) => (
    <span style={{ color: 'red' }} key={`adm${i}`}>Admin</span>
  ));
  replaced = replacer(replaced, MARKUP_MOD_REGEXP, (match, i) => (
    <span style={{ color: 'blue' }} key={`mod${i}`}>Moderator</span>
  ));
  return replaced;
}

export function parseReplies(text, onTouchTap, onMouseEnter, onMouseMove, onMouseLeave) {
  const replaced = replacer(text, REPLY_REGEXP, (match, i) => (
    <a
      href=''
      key={`r${i}`}
      onClick={e => e.preventDefault()}
      onTouchTap={() => onTouchTap(match)}
      onMouseEnter={() => onMouseEnter(match)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      @{match}
    </a>
  ));
  return replacer(replaced, PRIVATE_REGEXP, (match, i) => (
    <a
      href=''
      key={`p${i}`}
      onClick={e => e.preventDefault()}
      onTouchTap={() => onTouchTap(match)}
    >
      !#{match}
    </a>
  ));
}

export function parseLinks(text) {
  return replacer(text, LINK_REGEXP, (match, i) => (
    <a href={match} target='_blank' key={`link${i}`}>{match}</a>
  ));
}

export function replaceYoutubeLink(text, title) {
  return replacer(text, YOUTUBE_REPLACE_REGEXP, (match, i) => (
    <a href={match} target='_blank' key={`youtube${i}`}>{title}</a>
  ));
}
