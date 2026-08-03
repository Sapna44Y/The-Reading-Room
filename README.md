# The Reading Room

The Reading Room is a personal book-management app that helps readers organize their library and keep track of what they want to read, are currently reading, and have completed.

**Live app:** [https://the-reading-room-irrr.vercel.app/](https://the-reading-room-irrr.vercel.app/)

## Features

- Create an account and sign in securely
- Add, edit, and remove books from a personal library
- Track books as **Want to Read**, **Reading**, or **Completed**
- Organize books with tags and filter the library by tag or reading status
- View dashboard totals and recently added books
- Keep each user's books private with JWT-based authentication

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, JavaScript |
| Database | MongoDB with Mongoose |
| Authentication | JWT and bcrypt |
| Validation | Zod (frontend) and Joi (backend) |
| Deployment | Vercel |

## Project Structure

```text
ThumbStacks/
├── frontend/   # Next.js web application
└── backend/    # Express REST API
```

## Run Locally

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local` from `.env.local.example` and set the API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` with:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=36h
CORS_ORIGIN=http://localhost:3000
```

Start the API:

```bash
npm run dev
```

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Sign in and receive a token |
| POST | `/auth/logout` | Sign out |
| GET/POST | `/books` | List or add books |
| PUT/DELETE | `/books/:id` | Update or delete a book |
| GET | `/dashboard` | Get reading statistics and recent books |

Protected endpoints require an `Authorization: Bearer <token>` header.

## Deployment

The frontend is deployed on Vercel:

[Open The Reading Room](https://the-reading-room-irrr.vercel.app/)
