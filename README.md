Project Documentation: DevOps Tier-3 Web Application

1. Project Overview
This project is a full-stack 3-Tier Web Application designed to demonstrate modern DevOps practices. It transitions a traditional web app into a fully containerized, automated, and cloud-hosted solution. The application allows users to create, view, and delete user data, simulating real-world CRUD operations.

The core goal was not just to write code, but to build a resilient infrastructure using Docker, automate the delivery using GitHub Actions, and deploy it to a live production server on AWS EC2.

2. Technical Architecture (The 3 Tiers)
The application follows a strict separation of concerns, divided into three distinct layers. These layers communicate over a network, just like enterprise-grade software.

Tier 1: The Frontend (Presentation Layer)
Technology: Next.js (React Framework).

Port: Runs on Port 3000.

Role: This is what the user sees. It provides the UI for adding and listing users.

Networking Logic: Since this runs in the user's browser, it cannot talk to "localhost" to find the backend. Instead, it is configured to send API requests to the Public IP of the AWS EC2 instance.

Tier 2: The Backend (Application Logic Layer)
Technology: Node.js with Express.js.

Port: Runs on Port 5000.

Role: It acts as the bridge. It receives JSON requests from the Frontend, processes the logic, and runs SQL queries against the Database.

Networking Logic: It runs inside a Docker container. It does not store data itself; it connects to the Database container using the internal Docker service name (e.g., db or mysql), ensuring secure isolation.

Tier 3: The Database (Data Layer)
Technology: MySQL 8.0.

Port: Runs on Port 3306 (Internal Docker Network).

Role: Persists the data (Users, Emails, IDs).

Security: It is not exposed to the public internet. Only the Backend container can talk to it via the private Docker network.

3. DevOps & Automation Workflow
This project implements a complete CI/CD Pipeline (Continuous Integration / Continuous Deployment) using GitHub Actions. This automation ensures that bad code never reaches production.

Phase 1: Continuous Integration (CI)
Every time code is pushed to the main branch, GitHub Actions triggers a "Sanity Check":

Frontend Check: It installs the Next.js dependencies and attempts a build. If there is a syntax error in the React code, the pipeline fails immediately.

Backend Check: It installs the Node.js dependencies and verifies the server code is valid.

Result: If either check fails, the process stops, preventing broken builds.

Phase 2: Continuous Delivery (CD)
If (and only if) the CI checks pass, the pipeline moves to the Build & Push phase:

Docker Build: It builds optimized Docker images for both the Frontend and Backend.

Environment Injection: During the build, it injects the Production Environment variables (like the AWS EC2 IP address) so the frontend knows where to connect.

Registry Push: It logs into Docker Hub securely and pushes the new images, tagging them as latest.

4. Deployment Strategy (AWS EC2)
The application is deployed on an AWS EC2 instance (Ubuntu Linux). We use Docker Compose to orchestrate the services on the server.

Infrastructure Setup:
Security Groups:

Port 3000 (Open): For users to access the Website.

Port 5000 (Open): For the Frontend to send API data.

Port 22 (Restricted): For SSH access.

Docker Compose:

A docker-compose.yml file sits on the server.

It defines the 3 services (Frontend, Backend, Database).

It manages the environment variables (Database passwords, API URLs).

It handles the Restart Policy (restart: always), ensuring the app comes back online automatically if the server reboots.

Update Process:
To deploy a new version, we simply run:

docker compose pull (Downloads the fresh images from Docker Hub).

docker compose up -d (Recreates the containers with the new code).

5. Key Challenges & Solutions
During development, several critical networking issues were solved:

Issue: "Connection Refused" on the Frontend.

Root Cause: The Frontend was trying to fetch data from localhost:5000. In a production environment, localhost refers to the user's computer, not the server.

Solution: Configured Dynamic Environment Variables to switch the API URL to the EC2 Public IP during the Docker build process.

Issue: Backend crashing with "Cannot Connect to Database".

Root Cause: The Backend tried connecting to localhost. Inside a container, localhost is the container itself, not the database.

Solution: Updated the connection string to use the Docker Service Name (db), utilizing Docker's internal DNS resolution.

6. How to Run Locally
Clone the Repository: git clone https://github.com/yourusername/devops-tier3-app.git

Configure Environment: Create a .env file with your database credentials (MYSQL_ROOT_PASSWORD, MYSQL_DATABASE, etc.).

Start the Stack: docker compose up -d

Access the App:

Frontend: http://localhost:3000

Backend Health: http://localhost:5000/users
