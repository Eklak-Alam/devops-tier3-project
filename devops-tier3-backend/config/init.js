// config/init.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    try {
        // 1. Connect to MySQL Server (No Database selected yet)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        const dbName = process.env.DB_NAME;

        // 2. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`✅ Database '${dbName}' checked/created.`);

        // 3. Select Database
        await connection.changeUser({ database: dbName });

        // 4. Create Users Table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await connection.query(createTableQuery);
        console.log(`✅ Table 'users' checked/created.`);

        await connection.end(); // Close this setup connection
    } catch (error) {
        console.error("❌ Database Initialization Failed:", error);
        process.exit(1); // Stop app if DB fails
    }
}

module.exports = initializeDatabase;