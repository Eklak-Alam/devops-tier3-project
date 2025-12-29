const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./config/init'); // Import setup script
const db = require('./config/db'); // Import connection pool

const app = express();
app.use(express.json());
app.use(cors());

// --- ROUTES ---

// 1. GET ALL USERS
app.get('/users', (req, res) => {
    const q = "SELECT * FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// 2. CREATE USER
app.post('/users', (req, res) => {
    const q = "INSERT INTO users (`name`, `email`) VALUES (?)";
    const values = [req.body.name, req.body.email];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json("User created successfully");
    });
});

// 3. DELETE USER
app.delete('/users/:id', (req, res) => {
    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User deleted successfully");
    });
});

// --- STARTUP LOGIC ---
const PORT = process.env.PORT || 5000;

// Run DB Setup first, THEN start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Backend Server running on Port ${PORT}`);
    });
});