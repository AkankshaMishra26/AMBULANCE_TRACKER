const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

// Create and connect to the SQLite database
const db = new sqlite3.Database('./database.db');

// Create ambulances table if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ambulances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL
    )`);
});

app.use(bodyParser.json());

// Middleware to handle authentication
const authenticate = (req, res, next) => {
    // Perform authentication here
    // For simplicity, let's assume a hardcoded username and password
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    });
};

// Routes
app.get('/api/ambulances', authenticate, (req, res) => {
    // Fetch all ambulances
    db.all('SELECT * FROM ambulances', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync('password', 10); // Hashed password for 'password'

    if (username === 'admin' && bcrypt.compareSync(password, hashedPassword)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.delete('/api/ambulances/:id', authenticate, (req, res) => {
    // Delete ambulance
    const id = req.params.id;

    db.run('DELETE FROM ambulances WHERE id = ?', id, function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: 'Ambulance not found' });
            } else {
                res.json({ message: 'Ambulance deleted successfully' });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
