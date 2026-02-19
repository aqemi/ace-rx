'use strict';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import './style.less';

export default function MarqueeText({ children, className }) {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const check = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    setOffset(overflow > 0 ? overflow : 0);
  }, []);

  useEffect(() => {
    check();
  }, [children, check]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [check]);

  const style = offset
    ? { '--marquee-offset': `-${offset}px`, '--marquee-duration': `${offset / 8}s` }
    : undefined;

  return (
    <div className={className} ref={containerRef}>
      <span className={offset ? 'marquee-text' : ''} style={style}>{children}</span>
    </div>
  );
}
