# VideoTube — Backend API

RESTful API for the VideoTube platform built with **Node.js**, **Express 5**, and **MongoDB**.

## Features

- JWT auth (access + refresh tokens) with HTTP-only cookies
- Video upload & streaming via Cloudinary
- Tweets, comments, likes, playlists, subscriptions
- Channel dashboard & watch history
- Paginated responses with aggregate pipelines

## Tech Stack

Node.js · Express 5 · MongoDB / Mongoose · JWT · Bcrypt · Multer · Cloudinary

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev             # development (nodemon)
npm start               # production
```

### Environment Variables

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
COR_ORIGIN=*
ACCESS_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## API Endpoints

Base URL: `/api/v1`

| Route              | Methods                  | Description                       |
| ------------------ | ------------------------ | --------------------------------- |
| `/healthcheck`     | GET                      | Server status                     |
| `/users`           | POST, GET, PATCH         | Register, login, profile, avatar  |
| `/videos`          | GET, POST, PATCH, DELETE | CRUD + publish toggle             |
| `/tweets`          | GET, POST, PATCH, DELETE | User tweets                       |
| `/comments`        | GET, POST, PATCH, DELETE | Video comments (paginated)        |
| `/likes`           | GET, POST                | Toggle likes on videos/comments/tweets |
| `/playlists`       | GET, POST, PATCH, DELETE | Playlist management               |
| `/subscriptions`   | GET, POST                | Subscribe / unsubscribe channels  |
| `/dashboard`       | GET                      | Channel stats & videos            |

## Project Structure

```
src/
├── controllers/     # Route handlers
├── db/              # Database connection
├── middlewares/      # Auth & file upload
├── models/          # Mongoose schemas
├── routes/          # Route definitions
├── utils/           # APIError, APIResponse, asyncHandler, cloudinary
├── app.js           # Express app config
├── constants.js     # App constants
└── index.js         # Entry point
```
