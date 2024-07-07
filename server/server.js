// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');
// const app = express();
// app.use(express.json());

// // Path to the tournaments data file
// const DATA_FILE = path.join(__dirname, 'tournaments.json');

// // Function to read data from the file
// const readDataFromFile = () => {
//   try {
//     const data = fs.readFileSync(DATA_FILE, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// };

// // Function to write data to the file
// const writeDataToFile = (data) => {
//   fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
// };

// // Load tournaments data
// let tournaments = readDataFromFile();

// // Endpoint to get all tournaments
// app.get('/api/tournaments', (req, res) => {
//   res.json(tournaments);
// });

// // Endpoint to get a tournament by ID
// app.get('/api/tournaments/:id', (req, res) => {
//   const tournament = tournaments.find(t => t.id === req.params.id);
//   if (!tournament) {
//     return res.status(404).json({ message: 'Tournament not found' });
//   }
//   res.json(tournament);
// });

// // Endpoint to create a new tournament
// app.post('/api/tournaments', (req, res) => {
//   const { name, startDate, endDate, numRounds, data} = req.body;
//   const newTournament = { id: uuidv4(), name, startDate, endDate, numRounds, data };
//   tournaments.push(newTournament);
//   writeDataToFile(tournaments);
//   res.status(201).json(newTournament);
// });

// // Endpoint to delete a tournament by ID
// app.delete('/api/tournaments/:id', (req, res) => {
//   tournaments = tournaments.filter(tournament => tournament.id !== req.params.id);
//   writeDataToFile(tournaments);
//   res.status(200).json({ message: 'Tournament deleted' });
// });

// // Endpoint to get a tournament for editing by ID
// app.get('/api/edittour/:id', (req, res) => {
//   const tournament = tournaments.find(t => t.id === req.params.id);
//   if (!tournament) {
//     return res.status(404).json({ message: 'Tournament not found' });
//   }
//   res.json(tournament);
// });

// // Endpoint to update a tournament by ID (PUT method)
// app.put('/api/edittour/:id', (req, res) => {
//   const { id } = req.params;
//   const { rounds, matches, contestants } = req.body;
  
//   const tournamentIndex = tournaments.findIndex(t => t.id === id);
//   if (tournamentIndex === -1) {
//     return res.status(404).json({ message: 'Tournament not found' });
//   }

//   tournaments[tournamentIndex] = {
//     ...tournaments[tournamentIndex],
//     rounds,
//     matches,
//     contestants
//   };

//   writeDataToFile(tournaments);
//   res.json(tournaments[tournamentIndex]);
// });


// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });

const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

// Path to the tournaments data file
const DATA_FILE = path.join(__dirname, 'tournaments.json');

// Function to read data from the file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Function to write data to the file
const writeDataToFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Load tournaments data
let tournaments = readDataFromFile();

// Endpoint to get all tournaments
app.get('/api/tournaments', (req, res) => {
  res.json(tournaments);
});

// Endpoint to get a tournament by ID
app.get('/api/tournaments/:id', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' });
  }
  res.json(tournament);
});

// Endpoint to create a new tournament
app.post('/api/tournaments', (req, res) => {
  const { name, startDate, endDate, numRounds } = req.body;
  const newTournament = {
    id: uuidv4(),
    name,
    startDate,
    endDate,
    numRounds,
    bracket: {
      rounds: Array.from({ length: numRounds }, (_, index) => ({ name: `Round ${index + 1}` })),
      matches: [],
      contestants: {}
    }
  };
  tournaments.push(newTournament);
  writeDataToFile(tournaments);
  res.status(201).json(newTournament);
});

// Endpoint to delete a tournament by ID
app.delete('/api/tournaments/:id', (req, res) => {
  tournaments = tournaments.filter(tournament => tournament.id !== req.params.id);
  writeDataToFile(tournaments);
  res.status(200).json({ message: 'Tournament deleted' });
});

// Endpoint to update a tournament by ID (PUT method)
app.put('/api/tournaments/:id', (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, numRounds, bracket } = req.body;
  
  const tournamentIndex = tournaments.findIndex(t => t.id === id);
  if (tournamentIndex === -1) {
    return res.status(404).json({ message: 'Tournament not found' });
  }

  tournaments[tournamentIndex] = {
    ...tournaments[tournamentIndex],
    name,
    startDate,
    endDate,
    numRounds,
    bracket
  };

  writeDataToFile(tournaments);
  res.json(tournaments[tournamentIndex]);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
