const express = require('express');
const cors = require('cors');
const db = require('./data/db');
const server = express();

server.use(express.json());
server.use(cors());

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
server.put('/api/users/:id', (req, res) => {
  const { params: { id }, body: changes } = req;

  if (!changes.name || !changes.bio) {
    return res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
  }

  db.update(id, changes).then(
    count => Boolean(count)
      ? db.findById(id).then(user => res.status(200).json(user))
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' }),
    error => res.status(500).json({ error: `The user information could not be modified; ${error}` })
  );
});

// D - DELETE
server.delete('/api/users/:id', (req, res) => {
  const { params: { id } } = req;

  db.remove(id).then(
    count => Boolean(count)
      ? res.status(200).json(count)
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' }),
    error => res.status(500).json({ error: `The user could not be removed; ${error}` })
  );
});

server.listen(4000, () => {
  console.info('** API up and running on port 4k **');
});
