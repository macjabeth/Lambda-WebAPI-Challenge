const express = require('express');
const db = require('./data/db');
const server = express();

server.use(express.json());

// C - POST
server.post('/api/users', (req, res) => {
  const { body: user } = req;

  if (!user.name || !user.bio) {
    return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
  }

  db.insert(user).then(
    userDocument => res.status(201).json(userDocument),
    error => res.status(500).json({ error: `There was an error while saving the user to the database; ${error}` })
  );
});

// R - GET

// U - PUT

// D - DELETE
