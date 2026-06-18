# VideoTube — Twitter + YouTube Hybrid Backend API

A production-ready RESTful backend API built with **Node.js**, **Express**, **MongoDB**, and **Cloudinary**. Combines YouTube-like video publishing with Twitter-style tweeting into a unified social media platform.

## Features

- **User Management** — Register, login, JWT token-based auth, avatar/cover image uploads
- **Video Management** — Upload, publish, search, paginate, update, delete videos
- **Tweeting** — Create, read, update, delete tweets
- **Comments** — Comment on videos with pagination
- **Likes** — Toggle likes on videos, comments, and tweets
- **Playlists** — Create and manage video playlists
- **Subscriptions** — Subscribe/unsubscribe to channels
- **Dashboard** — Channel stats (views, subscribers, videos, likes)
- **Healthcheck** — Server status endpoint

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens) with HTTP-only cookies
- **File Upload**: Multer (local) → Cloudinary (cloud)
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js v18+
- MongoDB Atlas URI or local MongoDB instance
- Cloudinary account (cloud_name, api_key, api_secret)

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
COR_ORIGIN=*
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd 04

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

Base URL: `/api/v1`

### Healthcheck
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthcheck` | Server health status |

### Users (`/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register with avatar & cover image |
| POST | `/login` | No | Login with email/username |
| POST | `/logout` | Yes | Logout (clears tokens) |
| POST | `/refresh-token` | No | Refresh access token |
| POST | `/change-password` | Yes | Change password |
| GET | `/current-user` | Yes | Get current user profile |
| PATCH | `/update-details` | Yes | Update name/email |
| PATCH | `/avatar` | Yes | Update avatar image |
| PATCH | `/cover-image` | Yes | Update cover image |
| GET | `/c/:userName` | Yes | Get channel profile |
| GET | `/history` | Yes | Get watch history |

### Videos (`/videos`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get all videos (paginated, searchable) |
| POST | `/` | Yes | Publish a video |
| GET | `/:videoId` | Yes | Get video details |
| PATCH | `/:videoId` | Yes | Update video details |
| DELETE | `/:videoId` | Yes | Delete a video |
| PATCH | `/toggle/publish/:videoId` | Yes | Toggle publish status |

### Tweets (`/tweets`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Create a tweet |
| GET | `/user/:userId` | Yes | Get user's tweets |
| PATCH | `/:tweetId` | Yes | Update a tweet |
| DELETE | `/:tweetId` | Yes | Delete a tweet |

### Comments (`/comments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:videoId` | Yes | Get video comments (paginated) |
| POST | `/:videoId` | Yes | Add a comment |
| PATCH | `/c/:commentId` | Yes | Update a comment |
| DELETE | `/c/:commentId` | Yes | Delete a comment |

### Likes (`/likes`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/toggle/v/:videoId` | Yes | Toggle video like |
| POST | `/toggle/c/:commentId` | Yes | Toggle comment like |
| POST | `/toggle/t/:tweetId` | Yes | Toggle tweet like |
| GET | `/videos` | Yes | Get all liked videos |

### Playlists (`/playlists`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Yes | Create a playlist |
| GET | `/:playlistId` | Yes | Get playlist details |
| PATCH | `/:playlistId` | Yes | Update playlist |
| DELETE | `/:playlistId` | Yes | Delete playlist |
| PATCH | `/add/:videoId/:playlistId` | Yes | Add video to playlist |
| PATCH | `/remove/:videoId/:playlistId` | Yes | Remove video from playlist |
| GET | `/user/:userId` | Yes | Get user's playlists |

### Subscriptions (`/subscriptions`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/c/:channelId` | Yes | Toggle subscription |
| GET | `/c/:channelId` | Yes | Get channel subscribers |
| GET | `/u/:subscriberId` | Yes | Get subscribed channels |

### Dashboard (`/dashboard`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats` | Yes | Get channel statistics |
| GET | `/videos` | Yes | Get channel videos |

## Project Structure

```
src/
├── controllers/        # Route handlers
│   ├── user.controllers.js
│   ├── video.controllers.js
│   ├── tweet.controllers.js
│   ├── comment.controllers.js
│   ├── like.controllers.js
│   ├── playlist.controllers.js
│   ├── subscription.controllers.js
│   ├── dashboard.controllers.js
│   └── healthcheck.controllers.js
├── db/                 # Database connection
│   └── index.js
├── middlewares/        # Express middlewares
│   ├── auth.middlewares.js
│   └── multer.middlewares.js
├── models/             # Mongoose schemas
│   ├── user.model.js
│   ├── video.model.js
│   ├── tweet.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   └── subscription.model.js
├── routes/             # Express route definitions
│   ├── user.routes.js
│   ├── video.routes.js
│   ├── tweet.routes.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── subscription.routes.js
│   ├── dashboard.routes.js
│   └── healthcheck.routes.js
├── utils/              # Utility classes/functions
│   ├── APIError.js
│   ├── APIResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── app.js              # Express app setup
├── constants.js        # App constants
└── index.js            # Entry point
```

## Deployment

The app is ready to deploy on platforms like Railway, Render, or Fly.io:

1. Set all environment variables on your hosting platform
2. The `npm start` command runs the production server
3. Ensure your MongoDB Atlas allows connections from the deployment IP
4. Configure Cloudinary settings for media storage

## License

ISC
