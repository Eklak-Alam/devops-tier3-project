# 🚀 DevOps Tier-3 Web Application (Jenkins + Docker + AWS)

![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 1. Project Overview
This project is an enterprise-grade **3-Tier Web Application** that demonstrates the complete DevOps lifecycle. It transitions a traditional web app into a fully containerized, automated, and cloud-hosted solution using a self-hosted **Jenkins CI/CD pipeline**.

The goal was to simulate a real-world production environment where code changes committed to **GitHub** automatically trigger a pipeline that builds Docker images, pushes them to a registry, and updates a live **AWS EC2** server without human intervention.

---

## 2. Technical Architecture
The application follows a microservices architecture pattern with strict isolation between layers.

### 🔹 Tier 1: The Frontend (Presentation)
- **Tech:** Next.js (React).
- **Role:** User Interface for CRUD operations.
- **Networking:** Configured dynamically during the Docker build process to point to the **Backend API's Public IP** (AWS EC2), ensuring users across the internet can connect.

### 🔹 Tier 2: The Backend (Logic)
- **Tech:** Node.js (Express).
- **Role:** API Gateway. Validates requests and communicates with the database.
- **Networking:** Runs in a secure Docker network. Connects to the database using the internal service hostname `database`, ensuring isolation.

### 🔹 Tier 3: The Database (Storage)
- **Tech:** MySQL 8.0.
- **Role:** Persistent data storage.
- **Security:** Completely isolated. No public ports are open; only the Backend container can access it via the Docker network.

---

## 3. DevOps Infrastructure
We evolved from cloud-based CI to a robust, self-hosted infrastructure.

| Component | Description |
| :--- | :--- |
| **Jenkins Master** | A dedicated EC2 instance running Jenkins (Java 17) and Docker. It acts as the "Command Center." |
| **App Server** | The live Production EC2 instance hosting the 3-Tier application containers. |
| **Docker Hub** | Used as the Container Registry to store versioned images. |
| **Security** | SSH Keys (`.pem`) and credentials managed securely via Jenkins Credential Store. |

---

## 4. The Jenkins CI/CD Pipeline
I implemented a **Declarative Pipeline** (`Jenkinsfile`) that executes automatically via GitHub Webhooks.

### ⚙️ Stage 1: Checkout SCM
Jenkins pulls the latest code from the GitHub repository (`main` branch) to its local workspace.

### ⚙️ Stage 2: Build & Push (Docker)
Jenkins acts as the build server:
1.  **Backend Build:** Builds the Node.js image and pushes it to Docker Hub.
2.  **Frontend Build (Dynamic Injection):** Jenkins injects the **EC2 Public IP** (`NEXT_PUBLIC_API_URL`) as a build argument. This "bakes" the API address into the static React files.

### ⚙️ Stage 3: Deploy to Production
Jenkins connects to the **App Server** via SSH to deploy updates:
1.  **File Transfer (`scp`):** Copies the `docker-compose.yml` configuration to the server.
2.  **Remote Execution (`ssh`):** Runs the deployment commands:
    ```bash
    sudo docker-compose down
    sudo docker-compose pull
    sudo docker-compose up -d
    sudo docker image prune -f
    ```

---

## 5. Challenges & Solutions
Real-world engineering problems solved during development.

### ❌ Challenge 1: The "Missing Script" Crash
* **Issue:** Backend container started and immediately crashed.
* **Diagnosis:** `npm error: Missing script: "start"`. The `package.json` was missing the start command.
* **Solution:** Updated `package.json` to include `"start": "node index.js"`.

### ❌ Challenge 2: Docker Command Mismatch
* **Issue:** Deployment failed with `docker: unknown command: docker compose`.
* **Diagnosis:** The App Server had an older Docker version requiring the hyphenated command.
* **Solution:** Updated Jenkins Pipeline to use `docker-compose` instead of `docker compose`.

### ❌ Challenge 3: Frontend "Connection Timed Out"
* **Issue:** Frontend loaded but couldn't fetch data (tried connecting to an old IP).
* **Diagnosis:** `Dockerfile` didn't accept build arguments, so the new IP wasn't baked in.
* **Solution:** Added `ARG NEXT_PUBLIC_API_URL` to the Dockerfile and updated Jenkins to pass the variable during build.

### ❌ Challenge 4: Configuration Drift
* **Issue:** App Server complained `Can't find configuration file`.
* **Solution:** Added an `scp` step in Jenkins to transfer `docker-compose.yml` before deployment.

---

## 6. How to Run & Verify

### 1️⃣ The Automation
1.  Push a change to GitHub.
2.  Jenkins triggers automatically via **Webhook**.
3.  Pipeline stages turn Green: **Checkout** ✅ → **Build** ✅ → **Deploy** ✅.

### 2️⃣ The Verification
1.  Access the site at `http://<EC2-IP>:3000`.
2.  **Add a User:** Submit a name/email via the UI.
3.  **Verify Persistence:** SSH into the DB container:
    ```bash
    sudo docker exec -it production-db bash
    mysql -u root -p
    USE myappdb;
    SELECT * FROM users;
    ```