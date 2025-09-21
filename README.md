# Trail Race Application

This project is an event-driven CQRS microservice application for managing trail races and applications.  
It consists of:  

- **Command service** (port `3000`) — handles writes (create, update, delete) and publishes events  
- **Query service** (port `4000`) — handles reads (get one, get all) and persists changes to Postgres  
- **Client (React)** (port `5173` in dev) — UI for Applicants and Administrators  
- **Postgres** — stores races, applications, and users  
- **RabbitMQ** — message broker for communication between services  

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)  
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)  

---

## Setup & Run

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd trail-race

2. **Start infrastructure (DB + RabbitMQ)**
docker compose up -d
Postgres runs on localhost:5432 (user: postgres, password: postgres, db: trail_race_app)

RabbitMQ runs on localhost:5672 with a management UI at http://localhost:15672
 (user: guest, password: guest)
