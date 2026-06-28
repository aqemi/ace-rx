import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

const fixturePath = resolve(__dirname, 'fixtures/chat.json');

function chatFixturePlugin() {
  return {
    name: 'chat-fixture',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (url.searchParams.get('app') !== 'chat') return next();

        if (req.method === 'GET') {
          const fixture = JSON.parse(readFileSync(fixturePath, 'utf-8'));
          const last = Number(url.searchParams.get('last') || 0);
          const data = last === 0 ? fixture.data : [];
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ data, user_cnt: fixture.user_cnt }));
          return;
        }

        if (req.method === 'POST') {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('ok');
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Get git short hash for version
  let gitHash = '';
  try {
    gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch (e) {
    gitHash = 'unknown';
  }

  const version = `${pkg.version}#${gitHash}`;

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      ...(mode === 'fixture' ? [chatFixturePlugin()] : [])
    ],
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __APP_EMAIL_B64__: JSON.stringify(Buffer.from(env.VITE_EMAIL_ADDRESS || '').toString('base64')),
      // In fixtures mode, point API calls at the local dev server (empty base = relative URLs)
      ...(mode === 'fixture' ? {
        'import.meta.env.VITE_API_URL': JSON.stringify(''),
        'import.meta.env.VITE_WEB_URL': JSON.stringify('')
      } : {})
    },
    build: {
      outDir: 'dist'
    },
    css: {
      postcss: {
        plugins: [autoprefixer()]
      }
    }
  };
});
