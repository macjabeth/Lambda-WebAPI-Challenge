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
server.get('/api/users', (req, res) => {
  db.find().then(
    users => res.status(200).json(users),
    error => res.status(500).json({ error: `The users information could not be retrieved; ${error}` })
  );
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id).then(
    user => Boolean(user)
      ? res.status(200).json(user)
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' }),
    error => res.status(500).json({ error: `The user information could not be retrieved; ${error}` })
  );
});

// U - PUT

// D - DELETE
