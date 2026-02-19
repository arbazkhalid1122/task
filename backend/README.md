# Backend Setup Guide

This document explains how to set up and run the backend for the review platform.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)

3. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database (for development)
   npm run db:push

   # Or use migrations (for production)
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Database Schema

The database includes the following main models:
- **User**: User accounts with authentication
- **Company**: Companies being reviewed
- **Product**: Products under companies
- **Review**: User reviews with multi-criteria ratings
- **Comment**: Comments on reviews and posts
- **Reaction**: Likes, dislikes, and other reactions
- **Post**: Activity feed posts
- **Session**: User authentication sessions
- **Notification**: User notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Companies
- `GET /api/companies` - List companies (with pagination, search, category filter)
- `GET /api/companies/[slug]` - Get company by slug

### Reviews
- `GET /api/reviews` - List reviews (with pagination, filters)
- `POST /api/reviews` - Create new review (requires auth)
- `GET /api/reviews/[id]` - Get review by ID
- `POST /api/reviews/[id]/helpful` - Toggle helpful vote (requires auth)

### Feed & Search
- `GET /api/feed` - Get activity feed
- `GET /api/search` - Search companies, reviews, users
- `GET /api/trending` - Get trending items

## Development

### Database Management

- **View database in Prisma Studio:**
  ```bash
  npm run db:studio
  ```

- **Create a migration:**
  ```bash
  npm run db:migrate
  ```

- **Reset database (development only):**
  ```bash
  npx prisma migrate reset
  ```

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Authentication utilities
│   ├── utils.ts           # Helper functions
│   └── errors.ts          # Error handling

app/
├── api/                   # API routes
│   ├── auth/              # Authentication endpoints
│   ├── companies/         # Company endpoints
│   ├── reviews/           # Review endpoints
│   ├── feed/              # Feed endpoint
│   └── search/            # Search endpoint
└── lib/
    ├── fetch-data.ts      # Server-side data fetching
    └── api.ts             # Client-side API utilities
```

## Security Notes

- Always use environment variables for sensitive data
- JWT tokens are stored in httpOnly cookies
- Passwords are hashed using bcrypt
- Input validation is done using Zod schemas
- SQL injection is prevented by Prisma's query builder

## Next Steps

1. Set up email service for verification
2. Add file upload for images/videos
3. Implement real-time features (WebSockets)
4. Add rate limiting
5. Set up monitoring and logging

