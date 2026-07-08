# ✨ ace-rx ✨

## 📝 Description

ace-rx is a lightweight, React-based chat application with a clean and responsive UI. It supports real-time messaging with rich attachments — images, WebM videos, YouTube embeds, and Telegram links — plus a built-in media player and playlists.

## 🧰 Tech Stack

- **React 19** (class components) + **Redux Toolkit** / React-Redux
- **Vite 8** build tooling with the **React Compiler** babel preset
- **MUI** (Material UI) components with **Less** for module styling
- **dayjs** for dates, **colorthief** for palette extraction

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher) ⚡
- pnpm 📦

### Installation

```bash
# Clone the repository
git clone https://github.com/aqemi/ace-rx.git

# Navigate to the project directory
cd ace-rx

# Install dependencies
pnpm install
```

### Environment Setup

```bash
# Copy the environment template
cp env.template .env

# Edit the .env file and fill in your configuration values
```

Configuration variables:

| Variable | Description |
| --- | --- |
| `VITE_WEB_URL` | Site address (e.g. `http://example.org`) |
| `VITE_API_URL` | API base URL |
| `VITE_OG_TITLE` | OpenGraph title |
| `VITE_OG_DESCRIPTION` | OpenGraph description |
| `VITE_TG_LINK` | Telegram link |
| `VITE_GH_LINK` | GitHub link |
| `VITE_EMAIL_ADDRESS` | Contact email address |

## 🌟 Running Locally

```bash
# Start the development server
pnpm dev
```

Then open your browser and navigate to http://localhost:3000 (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧

## 🔨 Building for Production

```bash
# Create an optimized production build
pnpm build
```

The build will be created in the `dist` directory. Preview it locally with:

```bash
pnpm preview
```

## 🧹 Linting

```bash
# Auto-fix lint issues (ESLint, airbnb ruleset)
pnpm lint:fix
```

> There is currently no automated test suite — `pnpm test` exits with an error.

## 🏗️ Architecture

Every feature lives under `src/modules/<Name>/` and follows the same layout:

- `component.jsx` — pure presentational component
- `container.js` — `connect()` wiring (Redux state/dispatch → props)
- `reducer.js` / `slice.js` — state (newer modules use RTK `createSlice`)
- `actions.js` — thunks and plain action creators
- `api.js` — raw `fetch` calls
- `index.js` — re-exports + imports the module's Less file

## 📋 Features

- Real-time messaging (〜￣▽￣)〜
- Attachment support — images, WebM video, YouTube, Telegram 📷 🎬
- Media player with playlists 🎵
- Lightbox and image previews 🖼️
- Responsive design for all devices 📱 💻
- Customizable themes 🎨
- User avatars and profiles 👤

## ⚠️ Project Status

**Note:** This project is no longer being actively maintained (｡•́︿•̀｡)

## 📜 License

This project is licensed under the GPL-3.0 License - see the LICENSE file for details.
