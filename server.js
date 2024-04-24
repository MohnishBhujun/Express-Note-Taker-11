const express = require('express');
const path = require('path');
const fs = require('fs');
const uid = require('uid');

// Set up the Express app
const PORT = process.env.PORT || 3001;
const app = express();

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET route for /api/notes returns the db.json file
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);

// POST route for /api/notes to add a new note to the db.json file
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uid.uid();
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));
  db.push(newNote);
  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(db));
  res.json(newNote);
});

// DELETE route for /api/notes/:id to delete a note from the db.json file
app.delete('/api/notes/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));
  const newDb = db.filter(note => note.id !== req.params.id);
  fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(newDb));
  res.json({ ok: true });
});

// GET route for /notes returns notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// If no matching route is found default to home
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Listen for requests
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);