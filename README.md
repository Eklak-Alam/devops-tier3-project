# 🚀 DevOps Tier-3 Web Application (Jenkins + Docker + AWS)

![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

## 📋 Project Overview

This project simulates a real-world, enterprise-grade **DevOps Lifecycle**. It transforms a traditional 3-Tier Web Application into a fully containerized, automated, and cloud-hosted solution using a self-hosted **Jenkins CI/CD pipeline**.

**The Goal:** Eliminate manual deployment. Any code committed to **GitHub** automatically triggers a pipeline that builds Docker images, pushes them to a registry, and updates a live **AWS EC2** production server without human intervention.

---

## 🏗️ Technical Architecture

The application follows a strict microservices architecture with isolated networking.

| Tier | Component | Technology | Description |
| :--- | :--- | :--- | :--- |
| **1** | **Frontend** | Next.js (React) | User Interface. Connects to the Backend via a dynamic Public IP injected during build time. |
| **2** | **Backend** | Node.js (Express) | API Gateway. Validates requests and securely communicates with the database. |
| **3** | **Database** | MySQL 8.0 | Persistent storage. Isolated in a private Docker network (no public access). |

---

## ⚙️ The DevOps Infrastructure

We moved away from managed services to build a robust, self-hosted infrastructure on AWS.

- **Build Server (Jenkins Master):** An EC2 instance running Jenkins & Docker. It acts as the "Command Center" using a `Jenkinsfile` for pipeline orchestration.
- **Production Server (App Server):** A separate EC2 instance hosting the live application containers.
- **Container Registry:** Docker Hub is used to store versioned images of the Frontend and Backend.

---

## 🔄 CI/CD Pipeline Workflow (Pipeline as Code)

I implemented a **Declarative Pipeline** using a `Jenkinsfile` located in the root of the repository. This ensures version control for the build process itself.

### 📜 The Pipeline Stages

#### 1️⃣ Stage 1: Checkout SCM
Jenkins listens for a **GitHub Webhook** trigger and immediately pulls the latest code from the `main` branch.

#### 2️⃣ Stage 2: Build & Push (Docker)
Jenkins builds the Docker images and pushes them to Docker Hub.
> **Key Automation:** The frontend requires the backend's IP address to communicate. I used `ARG` injection in Docker to "bake" the **EC2 Public IP** (`NEXT_PUBLIC_API_URL`) into the React app during the build process.

#### 3️⃣ Stage 3: Deploy to Production
Jenkins connects to the Production App Server via SSH to execute the update:
1. **Transfer Config:** Copies the latest `docker-compose.yml` to the server using `scp`.
2. **Remote Deployment:** Executes shell commands remotely:
   ```bash
   sudo docker-compose down
   sudo docker-compose pull   # Pulls the fresh images we just built
   sudo docker-compose up -d  # Restarts containers with new code