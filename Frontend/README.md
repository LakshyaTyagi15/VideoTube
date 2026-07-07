# VideoTube — Frontend

React SPA for the VideoTube platform built with **React 19**, **Vite**, and **Tailwind CSS v4**.

## Features

- Auth flow — register (with avatar/cover upload) & login
- Home feed with video cards
- Video player with comments & likes
- Channel profiles with subscriber count
- Tweet feed — create, edit, delete, like
- Playlists, liked videos & watch history
- Creator dashboard with channel stats
- Protected routes for authenticated users
- Toast notifications & responsive UI

## Tech Stack

React 19 · Vite · Tailwind CSS 4 · React Router 7 · Axios · React Icons · date-fns

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
```

> Make sure the backend is running on `http://localhost:8000` before starting.

## Project Structure

```
src/
├── api/             # Axios instance & API service modules
├── assets/          # Static assets
├── components/
│   ├── Layout/      # Navbar, Sidebar, Layout wrapper
│   ├── ui/          # Reusable UI components
│   ├── VideoCard    # Video card component
│   ├── TweetCard    # Tweet card component
│   └── ProtectedRoute
├── context/         # AuthContext (React Context)
├── pages/           # Route pages
│   ├── Home         # Video feed
│   ├── Login / Register
│   ├── VideoPlayer  # Watch page with comments
│   ├── Channel      # Channel profile
│   ├── Tweets       # Tweet feed
│   ├── Dashboard    # Creator analytics
│   ├── Playlists / LikedVideos / History
└── main.jsx         # App entry point
```
