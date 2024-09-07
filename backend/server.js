const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json({limit:'50mb'}));
// app.use(bodyParser.json({ limit: '200mb' })); // Increase limit to 50mb or more as needed
// app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

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

//Function to write data to the file
const writeDataToFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

//Load tournaments data
let tournaments = readDataFromFile();

//Endpoint to get all tournaments
app.get('/api/tournaments', (req, res) => {
  res.json(tournaments);
});

//Endpoint to get a tournament by ID
app.get('/api/tournaments/:id', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({ message: 'Tournament not found' });
  }
  res.json(tournament);
});

//Endpoint to create a new tournament
app.post('/api/tournaments', (req, res) => {
  const { name, startDate, endDate, numRounds } = req.body;

  //Parse numRounds as an integer
  const rounds = [];
  const matches = [];
  const contestants = {};
  let player = [];
  let counter = 0;
  let roundIndex = 0;
  let orderCounter = 0;
  let playerId = 1;
  
  // Function to get contestant ID of the winner of a match from the previous round
  // const getWinnerId = (roundIndex, order) => {
  //   return matches.find(match => match.roundIndex === roundIndex && match.order === order).sides[0].contestantId;
  // };
  
  for (let i = numRounds; i > 0; i--) {
    counter = 2 ** (i - 1); // should match the number of matches for that round
    // to push the number of matches
    for (let j = counter; j > 0; j--) {
      const sides = []; // Reset sides array for each match
      // some things need to happen twice per match
      for (let twice = 0; twice < 2; twice++) {
        if (roundIndex === 0) {
          // Only assign players for the first round
          player = [{ title: `Player ${playerId}` }];
          let contestant = { entryStatus: "", players: player };
          contestants[playerId] = contestant; // store directly into contestants
          sides.push({ contestantId: playerId.toString(), scores: [{ mainScore: "", subscore: "" }, { mainScore: "", subscore: "" }, { mainScore: "", subscore: "" }], isWinner: false }); // per contestant
          // playerId++;
        } 
        // else {
        //   // player = [{ title: "TBD" }];
        //   // contestant = { entryStatus: "TBD", players: player };
        //   // contestants[playerId] = contestant;
        //   sides.push({ contestantId: "TBD", scores: [{ mainScore: "TBD", subscore: "TBD" }, { mainScore: "TBD", subscore: "TBD" }, { mainScore: "TBD", subscore: "TBD" }], isWinner: false });
        // }
        playerId++;
      }
      matches.push({ roundIndex: roundIndex, order: orderCounter, matchStatus: "", sides: sides });
      orderCounter++; // per match
    }
    // final
    if (counter === 1) {
      rounds.push({ name: `Final` });
    }
    // semifinal
    else if (counter === 2) {
      rounds.push({ name: `Semifinal` });
    }
    // quarterfinal
    else if (counter === 4) {
      rounds.push({ name: `Quarterfinal` });
    }
    // for -nd and -th
    else if ((counter * 2) % 10 === 2) {
      rounds.push({ name: `${counter * 2}nd` });
    }
    // remaining rounds
    else {
      rounds.push({ name: `${counter * 2}th` }); // Adjust if needed
    }
    roundIndex++; // increment roundIndex per round
    orderCounter = 0; // reset orderCounter for each round
  }

  const newTournament = {
    id: uuidv4(),
    name,
    startDate,
    endDate,
    numRounds: numRounds,
    bronzeBracket: {
      rounds,
      matches: matches,
      contestants
    },
    silverBracket: {
      rounds,
      matches: matches,
      contestants
    },
    goldBracket: {
      rounds,
      matches: matches,
      contestants
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

//Endpoint to update a tournament by ID (PUT method)
app.put('/api/tournaments/:id', (req, res) => {
  const { id } = req.params;
  const { name, startDate, endDate, numRounds, bronzeBracket, silverBracket, goldBracket } = req.body;
  
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
    bronzeBracket,
    silverBracket,
    goldBracket
  };

  writeDataToFile(tournaments);
  res.json(tournaments[tournamentIndex]);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
