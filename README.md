# Booking System

This is a **NestJS** project for managing bookings. The project uses **TypeORM** with **PostgreSQL** and is fully containerized using **Docker** and **Docker Compose**.

---

## Project Structure

```
.
├── src/                 # Source code
├── Dockerfile           # Docker image for the app
├── docker-compose.yml   # Docker Compose configuration
├── package.json
├── tsconfig.json
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- PostgreSQL 16 (via Docker)

---

## Installation & Setup

1. Clone the repository:

```bash

git clone https://github.com/AndruPod/booking-system.git
cd booking-system
```

2. Create a `.env` file in the project root with database configuration:

```
PORT=3000
POSTGRES_HOST=localhost(or "db" if you run ith Docker)
POSTGRES_PORT=5432
POSTGRES_DB=bookingSystem
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
JWT_SECRET=random_long_value
```

---

## Running with Docker

Start the application and database:

```bash

npm run docker:up
```

Check running containers:

```bash

docker ps
```

Stop the containers:

```bash

npm run docker:down
```

---

## Running Locally (without Docker)

1. Install dependencies:

```bash

npm install
```

2. Build the project:

```bash

npm run build
```

3. Start the server:

```bash

npm run start:dev
```

Server will run on `http://localhost:3000`.

---

## API Endpoints

- `GET /health` - Check server status
- `GET /apartments/get-all` - Get all apartments
- *(Add your endpoints here)*

---

## Code Style

- ESLint is configured via `eslint.config.mjs`
- Prettier is configured via `.prettierrc`

---

## Notes

- Ensure Docker is running before starting the containers.
- Use `.env` to store sensitive credentials and avoid committing it.
- `src/` contains all application source code.
