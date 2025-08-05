# Multi-Tenant Backend

A Node.js backend server built with Express, TypeScript, and Prisma.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma (PostgreSQL)
- Winston (Logging)

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── routes/        # Route definitions
├── services/      # Business logic
└── index.ts       # App entry point
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
- Copy `.env.development` for development
- Copy `.env.production` for production
- Update the database connection string and other variables

3. Initialize Prisma:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## API Endpoints

### Users

- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create new user
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

## Environment Variables

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing key
- `LOG_LEVEL`: Logging level
