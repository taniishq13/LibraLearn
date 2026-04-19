# LibraLearn

LibraLearn is a smart college library management system built with:

- Backend: Node.js, Express, TypeScript, MongoDB
- Frontend: React + TypeScript

## Features

- Student and librarian authentication with JWT
- Book management
- Borrow and return flow
- Overdue fine calculation
- Reviews and average ratings
- Recommendation engine with strategy and factory patterns

## Project Structure

- `backend/` - Express API and MongoDB models
- `frontend/` - React UI
- `idea.md`, `useCaseDiagram.md`, `sequenceDiagram.md`, `classDiagram.md`, `ErDiagram.md` - project documentation

## Run Backend

```bash
cd backend
npm install
npm run dev
```

To load demo data:

```bash
npm run seed
```

Create a `.env` file from `.env.example` before starting:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/libralearn
JWT_SECRET=replace_me_with_a_strong_secret
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

If the backend runs on a different URL, set:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/books`
- `POST /api/books`
- `POST /api/borrow`
- `POST /api/borrow/:recordId/return`
- `POST /api/reviews`
- `GET /api/recommendations`

## Demo Credentials

- Librarian: `librarian@libralearn.com` / `Password123`
- Student: `rahul@libralearn.com` / `Password123`
