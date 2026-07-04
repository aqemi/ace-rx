import React from 'react';
import Skeleton from '@mui/material/Skeleton';

// Varied line widths so the placeholder reads like a real conversation.
const MESSAGES = [
  ['45%'],
  ['70%', '30%'],
  ['35%'],
  ['60%', '40%'],
  ['25%'],
  ['65%', '75%', '20%'],
  ['40%'],
  ['55%', '35%']
];

export default function ChatSkeleton() {
  return (
    <div className='chat-skeleton'>
      {MESSAGES.map((lines, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className='chat-skeleton__message' key={i}>
          <Skeleton animation='wave' variant='circular' width={44} height={44} className='chat-skeleton__avatar' />
          <div className='chat-skeleton__body'>
            <Skeleton animation='wave' variant='text' width={56} className='chat-skeleton__id' />
            {lines.map((width, j) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton animation='wave' variant='text' width={width} className='chat-skeleton__line' key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
