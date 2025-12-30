# 🚀 DevOps Tier 3 Web Application

A full-stack **Tier 3 Architecture** application built to demonstrate modern DevOps practices, microservices communication, automated database management, and Containerization.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20MySQL-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![AWS](https://img.shields.io/badge/AWS-EC2-orange)

---

## 📖 Table of Contents
- [Architecture](#-architecture)
- [Deployment Pipeline](#-deployment-pipeline)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Docker Hub Repositories](#-docker-hub-repositories)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🏗 Architecture

The application follows a strict separation of concerns, deployed using **Docker Containers**:

* **Tier 1 (Presentation):** Next.js (Frontend) running on Port `3000`.
* **Tier 2 (Logic):** Node.js + Express (Backend API) running on Port `5000`.
* **Tier 3 (Data):** MySQL (Database) running securely on Port `3306` (Internal Network).

```mermaid
flowchart LR
    subgraph Client ["Tier 1: Client Side"]
        Browser[User Browser]
    end

    subgraph Server ["Tier 2: Application Server"]
        NextJS[Next.js Frontend] 
        NodeAPI[Node.js Backend API]
    end

    subgraph Data ["Tier 3: Database"]
        MySQL[(MySQL Database)]
    end

    Browser -- "Requests UI (:3000)" --> NextJS
    NextJS -- "Fetch Data (JSON)" --> NodeAPI
    NodeAPI -- "SQL Queries (:3306)" --> MySQL
    
    style NextJS fill:#000000,stroke:#fff,stroke-width:2px,color:#fff
    style NodeAPI fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    style MySQL fill:#00758f,stroke:#333,stroke-width:2px,color:#fff


    graph LR
    Dev(Developer) -- "git push" --> GitHub
    GitHub -- "Action Trigger" --> DockerHub
    DockerHub -- "Pull Image" --> EC2[AWS EC2 Instance]
    EC2 -- "docker compose up" --> LiveApp
    
    subgraph "AWS Production Environment"
        LiveApp --> Frontend
        LiveApp --> Backend
        LiveApp --> Database
    end

    
🚀 Getting Started (Run Locally)
Follow these steps to get the app running on your machine in under 5 minutes.



    ├── frontend/           # Next.js Application (Tier 1)
│   ├── Dockerfile     # Multi-stage build for React
│   └── src/
├── backend/            # Node.js Express API (Tier 2)
│   ├── Dockerfile     # Optimized Node image
│   └── server.js
├── database/           # Database Configuration (Tier 3)
│   └── init.sql       # Initial schema setup
├── docker-compose.yml  # Orchestration for all services
└── README.md


git clone [https://github.com/eklakalam/devops-tier3-app.git](https://github.com/eklakalam/devops-tier3-app.git)
cd devops-tier3-app

Create a .env file in the root directory. This keeps your secrets safe.

# .env
MYSQL_ROOT_PASSWORD=secretpassword
MYSQL_DATABASE=myappdb
MYSQL_USER=user
MYSQL_PASSWORD=userpassword
DB_HOST=database

3. Spin Up Containers
Use Docker Compose to build and start the entire stack.

docker compose up -d --build