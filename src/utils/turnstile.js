// Cloudflare Turnstile token provider.
//
// Renders a single managed widget (execution: 'execute', so the challenge only
// runs when we ask) the first time a token is requested, then calls
// turnstile.execute() to mint a fresh, single-use token per post. The token
// rides along in the chat POST FormData as `cf-turnstile-response` and is
// verified server-side (PHP) before the post is accepted.
//
// If VITE_TURNSTILE_SITEKEY is unset (e.g. local dev), getTurnstileToken()
// resolves to '' and the server bypasses the check (config['turnstile']
// disabled), so posting still works.

const SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY;

let widgetId = null;
let overlay = null;
// Whether the next post must carry a token. The server trusts a verified
// session for a while (config: session_ttl / session_max_posts), so once a post
// succeeds we stop attaching tokens until the server asks again (a 'captcha'
// response flips this back on). Starts true so the first post of a session
// challenges.
let needsToken = true;

export function isTokenNeeded() {
  return needsToken;
}

export function setTokenNeeded(value) {
  needsToken = value;
}
// Theme the widget was last rendered with, so we can detect a site theme change
// and re-render (Turnstile has no live per-widget theme setter).
let renderedTheme = null;
// Resolver/rejecter for the in-flight execute(); null when the widget is idle.
// Callbacks are registered once at render() time and route the result here, so
// we never stack multiple execute() calls on one widget.
let pending = null;
// True after a token has been minted and not yet reset. execute() on an
// already-solved widget is a no-op, so reset() first in that case.
let solved = false;
// Read the site's active color scheme. MUI's theme uses
// colorSchemeSelector: 'class', which toggles a plain `.dark` / `.light` class
// on <html>; mirror that onto the Turnstile widget's theme.
function currentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function hideOverlay() {
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function showOverlay() {
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function whenTurnstileReady() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }
    // The api.js script is loaded async in index.html; poll briefly for it.
    let waited = 0;
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        resolve(window.turnstile);
        return;
      }
      waited += 100;
      if (waited >= 10000) {
        clearInterval(interval);
        reject(new Error('Turnstile failed to load'));
      }
    }, 100);
  });
}

function settle(fn, value) {
  const p = pending;
  pending = null;
  hideOverlay();
  if (p) {
    fn(p, value);
  }
}

function ensureWidget(turnstile) {
  if (widgetId !== null) {
    return;
  }
  // Centered modal with a dimmed backdrop. Hidden by default; shown only while
  // a challenge is actually pending (see getTurnstileToken / settle).
  overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '2147483647';
  overlay.style.display = 'none';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'rgba(0, 0, 0, 0.6)';

  const container = document.createElement('div');
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  renderedTheme = currentTheme();
  widgetId = turnstile.render(container, {
    sitekey: SITEKEY,
    execution: 'execute',
    theme: renderedTheme,
    // Stay hidden while the managed challenge passes non-interactively; only
    // surface the widget when a human actually needs to interact with it.
    appearance: 'interaction-only',
    // Telemetry marker for Turnstile Spin; harmless if removed.
    action: 'turnstile-spin-v1',
    // Drive the backdrop off the actual interactive phase, not a timer: it
    // appears only when Turnstile needs to show the visitor a challenge, and
    // stays hidden for silent non-interactive passes (however long they take).
    'before-interactive-callback': () => {
      showOverlay();
    },
    'after-interactive-callback': () => {
      hideOverlay();
    },
    callback: (token) => {
      solved = true;
      settle((p, v) => p.resolve(v), token);
    },
    'error-callback': () => {
      solved = false;
      settle((p) => p.reject(new Error('Turnstile challenge failed')));
    },
    'expired-callback': () => {
      solved = false;
    }
  });
}

/**
 * Resolve to a fresh single-use Turnstile token, or '' when Turnstile is not
 * configured. Never rejects for a missing sitekey; rejects only on genuine
 * widget/load failure so the caller can surface a "try again" message.
 */
export async function getTurnstileToken() {
  if (!SITEKEY) {
    return '';
  }
  const turnstile = await whenTurnstileReady();
  // If the site theme changed since the widget was rendered, tear it down so
  // ensureWidget rebuilds it with the current theme (Turnstile can't retheme a
  // live widget). Cheap: the widget is idle and invisible between posts.
  if (widgetId !== null && renderedTheme !== currentTheme()) {
    turnstile.remove(widgetId);
    overlay.remove();
    widgetId = null;
    overlay = null;
    solved = false;
  }
  ensureWidget(turnstile);
  if (pending) {
    // A previous execute() is still resolving (e.g. a double-send); reject the
    // stale one rather than stacking a second execute() on the same widget.
    // Reset the widget too, so the abandoned challenge can't later fire its
    // callback and hand its token to the *new* caller below.
    settle((p) => p.reject(new Error('Turnstile request superseded')));
    solved = false;
    turnstile.reset(widgetId);
  }
  return new Promise((resolve, reject) => {
    pending = { resolve, reject };
    // A solved widget won't re-run execute(); clear the spent token first.
    if (solved) {
      solved = false;
      turnstile.reset(widgetId);
    }
    turnstile.execute(widgetId);
  });
}
