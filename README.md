# 🚀 DevOps Tier 3 Web Application

A full-stack **Tier 3 Architecture** application built to demonstrate modern DevOps practices, microservices communication, and automated database management.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20MySQL-blue)

## 🏗 Architecture
**Tier 1 (Presentation):** Next.js (Frontend)  
**Tier 2 (Application):** Node.js + Express (Backend API)  
**Tier 3 (Data):** MySQL (Database)

```mermaid
graph LR
    A[Client Browser] -- HTTP/3000 --> B(Next.js Frontend)
    B -- REST API/JSON --> C(Node.js Backend / Port 5000)
    C -- TCP/3306 --> D[(MySQL Database)]