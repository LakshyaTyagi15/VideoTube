# VideoTube

A full-stack video sharing and social media platform — combining YouTube-style video publishing with Twitter-style tweeting.

## Tech Stack

| Layer    | Technologies                                          |
| -------- | ----------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios     |
| Backend  | Node.js, Express 5, MongoDB, Mongoose, JWT, Cloudinary |

## Project Structure

```
├── Backend/    # REST API server
├── Frontend/   # React SPA client
└── README.md
```

## Quick Start

### 1. Backend

```bash
cd Backend
npm install
# configure .env (see Backend/Readme.md)
npm run dev
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies API calls to `http://localhost:8000`.

## Features

- User auth (register, login, JWT tokens)
- Video upload, publish, search & playback
- Tweets — create, like, delete
- Comments & likes on videos
- Playlists & subscriptions
- Channel dashboard with stats
- Watch history & liked videos

## License

ISC
