# 🚀 DevOps Tier 3 Web Application

A full-stack **Tier 3 Architecture** application built to demonstrate modern DevOps practices, microservices communication, automated database management, and Containerization.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20MySQL-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## 🏗 Architecture
The application follows a strict separation of concerns:
* **Tier 1 (Presentation):** Next.js (Frontend) running on Port 3000.
* **Tier 2 (Logic):** Node.js + Express (Backend API) running on Port 5000.
* **Tier 3 (Data):** MySQL (Database) running on Port 3306.

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

    Browser -- "Requests UI (Port 3000)" --> NextJS
    NextJS -- "Fetch Data (JSON)" --> NodeAPI
    NodeAPI -- "SQL Queries (Port 3306)" --> MySQL
    
    style NextJS fill:#000000,stroke:#fff,stroke-width:2px,color:#fff
    style NodeAPI fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    style MySQL fill:#00758f,stroke:#333,stroke-width:2px,color:#fff