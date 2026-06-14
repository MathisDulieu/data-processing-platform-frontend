# data-processing-platform-frontend

React frontend for the Data Processing Platform. Provides an interactive dashboard to monitor file imports, explore processed transactions, inspect rejected records, and configure batch scheduling.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v6
- Recharts
- Axios
- Lucide React

## Prerequisites

- Node.js 22+
- npm 10+
- `data-processing-platform-api` running locally on port `8080`

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the API | `http://localhost:8080` |

Create a `.env` file at the root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Railway Deployment

Set the following environment variables in your Railway service:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Your Railway API public URL |