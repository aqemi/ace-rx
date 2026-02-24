import react from '@vitejs/plugin-react';
import legacy, { cspHashes as legacyCspHashes } from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

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

  const cspLegacyHashPlugin = {
    name: 'csp-legacy-hashes',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = legacyCspHashes.map((h) => `'sha256-${h}'`).join(' ');
        return html.replace(/script-src\s+([^;]+);/, (_, srcs) => `script-src ${srcs.trim()} ${hashes};`);
      },
    },
  };

  return {
    plugins: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } }), legacy(), cspLegacyHashPlugin],
    define: {
      // Computed values that can't come from .env directly
      __APP_VERSION__: JSON.stringify(version),
      __APP_EMAIL_B64__: JSON.stringify(Buffer.from(env.VITE_EMAIL_ADDRESS || '').toString('base64')),
    },
    build: {
      outDir: 'dist',
    },
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
  };
});
