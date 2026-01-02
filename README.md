# 🚀 DevOps Tier 3 Web Application

> A production-ready **3-Tier Architecture** demonstrating modern DevOps practices: Microservices, Containerization, CI/CD Pipelines, and Cloud Deployment.

![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node%20%7C%20MySQL-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-Automated-2088FF?style=for-the-badge&logo=github-actions)
![AWS](https://img.shields.io/badge/AWS-EC2_Deployed-FF9900?style=for-the-badge&logo=amazon-aws)

---

## 📖 Table of Contents
- [🏗 System Architecture](#-system-architecture)
- [🔄 CI/CD Pipeline & Workflow](#-cicd-pipeline--workflow)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started (Local)](#-getting-started-local)
- [☁️ Deployment Guide (AWS EC2)](#-deployment-guide-aws-ec2)
- [🐋 Docker Hub Repositories](#-docker-hub-repositories)
- [🛠 Troubleshooting](#-troubleshooting)

---

## 🏗 System Architecture

This project strictly follows the **Three-Tier Architecture** pattern to ensure separation of concerns, scalability, and security.

### **The 3 Layers:**
1.  **Presentation Tier (Frontend):** Next.js Application running on Port `3000`.
2.  **Logic Tier (Backend):** Node.js + Express API running on Port `5000`.
3.  **Data Tier (Database):** MySQL Database running on Port `3306` (Internal Network only).

```mermaid
flowchart LR
    subgraph User_Space ["Tier 1: Client"]
        Browser[User Browser]
    end

    subgraph App_Server ["Tier 2: Application Logic"]
        NextJS[Next.js Frontend\n(Port 3000)] 
        NodeAPI[Node.js Backend\n(Port 5000)]
    end

    subgraph Data_Layer ["Tier 3: Database"]
        MySQL[(MySQL Database\nInternal: 3306)]
    end

    Browser -- "HTTP Request" --> NextJS
    NextJS -- "REST API Call" --> NodeAPI
    NodeAPI -- "SQL Query" --> MySQL
    
    style NextJS fill:#000000,stroke:#fff,stroke-width:2px,color:#fff
    style NodeAPI fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    style MySQL fill:#00758f,stroke:#333,stroke-width:2px,color:#fff

    graph TD
    Dev[Developer] -->|git push| GitHub
    
    subgraph "GitHub Actions (CI/CD)"
        direction TB
        Test[🧪 Phase 1: Sanity Checks] -->|Pass| Build[🐳 Phase 2: Build Images]
        Build -->|Success| Push[🚀 Phase 3: Push to DockerHub]
    end
    
    Push --> DockerHub
    DockerHub -->|Pull| AWS[AWS EC2 Production]
