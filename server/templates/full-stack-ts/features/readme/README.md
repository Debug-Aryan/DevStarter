# __PROJECT_NAME__

__PROJECT_DESCRIPTION__

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL

## Features
__FEATURES_LIST__

## Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (if running locally without Docker)

### Installation
1.  Clone the repo
2.  Install dependencies:
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

### Environment Variables
Copy `.env.example` to `.env` in `server/` directory and update the values.

### Running Development
1.  **Server**:
    ```bash
    cd server
    npm run dev
    ```
2.  **Client**:
    ```bash
    cd client
    npm run dev
    ```

## Docker
If enabled, you can run the entire stack with:
```bash
docker-compose up --build
```

## License
MIT
