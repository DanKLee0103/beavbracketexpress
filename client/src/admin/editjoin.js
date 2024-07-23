//For creating/deleting tournaments from admin side
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import '../App.css';
import { v4 as uuidv4 } from 'uuid';
import Bracket from '../components/bracket';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Editjoin(){
    const { data: tournaments, error, mutate } = useSWR('/api/tournaments', fetcher);
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [numRounds, setNumRounds] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedTournament, setSelectedTournament] = useState(null);
  
    if (error) return <div>Failed to load tournaments</div>;
    if (!tournaments) return <div>Loading...</div>;

    const deleteTournament = async (id) => {
        try {
          await mutate(
            (currentData) => {
              const updatedData = currentData.filter(tournament => tournament.id !== id);
              return updatedData;
            },
            false //Do not revaildate immediately
          );
    
          const response = await fetch(`/api/tournaments/${id}`, {
            method: 'DELETE',
          });
    
          if (!response.ok) {
            throw new Error('Failed to delete tournament');
          }
  
        } catch (err) {
          setErrorMessage(err.message);
        }
    };
    
    //HERE, I want to have it so that I let the user select options for the bracket: number of rounds specifically, which will allow to make the bracket
    //Just have the names be set automatically for each of the rounds depending on how many rounds
    const addTournament = async (e) => {
      e.preventDefault();
    
      const newTournament = {
        id: uuidv4(),
        name,
        startDate,
        endDate,
        numRounds,
        bronzeBracket: initializeEmptyBracket(numRounds),
        silverBracket: initializeEmptyBracket(numRounds),
        goldBracket: initializeEmptyBracket(numRounds) // Initialize bracket structure
      };
    
      //Update local data
      mutate(
        '/api/tournaments',
        [...tournaments, newTournament].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
        false
      );
    
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTournament),
      });
    
      if (!response.ok) {
        throw new Error('Failed to add tournament');
      }
    
      //Reval the SWR cache
      mutate('/api/tournaments');
    
      //reset form fields
      setName('');
      setStartDate('');
      setEndDate('');
      setNumRounds('');
    };
    
    //Function to initialize empty bracket based on numRounds
    const initializeEmptyBracket = (numRounds) => {
      //player -> contestant.players 
      //contestant -> contestants[contestantId]
      //score -> side.scores
      //side -> match.sides
      //obviously, round -> rounds and match->matches
      const rounds = [];
      const matches = [];
      const contestant = [];
      const player = [];
      const score = [];
      const side = [];
      let counter = 0;
      let roundIndex = 0;
      let orderCounter = 0;
      // let playerId = 1;
      for (let i = numRounds; i > 0; i--) {
        counter = 2**(i-1); //should match the number of matches for that round
        //to push the number of matches
        for (let j = counter; j > 0; j--) {
          matches.push({ roundIndex: roundIndex, order: orderCounter, sides: []})
          //some things need to happen twice per match
          for (let twice = 1; twice < 2**(numRounds)+1; twice++){
            player.push({title: `Player ${twice}`});
            contestant.push({entryStatus: "TBD", players: player});
            score.push({mainScore: "TBD", subscore: "TBD"});//could also add isWinner in here instead... see what's better later
            side.push({contestantId: twice.toString(), score: score, isWinner: false});//per contestant
          }
          orderCounter++;//per match
        }
        //final
        if(counter === 1){
          rounds.push({ name: `Final` });
        }
        //semifinal
        else if(counter === 2){
          rounds.push({ name: `Semifinal` });
        }
        //quarterfinal
        else if(counter === 4){
          rounds.push({ name: `Quarterfinal` });
        }
        //for -nd and -th
        else if ((counter*2)%10 === 2) {
          rounds.push({ name: `${counter*2}nd` });
        }
        //remaining rounds
        else{
          rounds.push({ name: `${counter*2}th` }); //Adjust if needed
        }
        roundIndex++; //increment roundIndex per round
        orderCounter = 0;//reset orderCounter for each round
      }
    
      const bracketData = {
        rounds: rounds,
        matches: matches, 
        contestants: {[side.contestantId]:contestant}
      };
    
      return bracketData;
    };
    
    return (
      <div>
        <h1>Want To Add or Delete A Tournament? (Admin)</h1>
        <ul id = "tournaments">
          {Array.isArray(tournaments) && tournaments
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .map((tournament) => (
              <li key={tournament.id}>
                {/* First go to the schedule page for each tournament as default */}
                  <Link to = {`/edittournament/schedule/${tournament.id}`} id = "edittournaments"> 
                      {tournament.name} - ({new Date(tournament.startDate).toLocaleDateString('en-US', {timeZone: 'UTC'})} -  
                      {new Date(tournament.endDate).toLocaleDateString('en-US', {timeZone: 'UTC'})})
                  </Link>
                  <button onClick={() => deleteTournament(tournament.id)}>Delete</button>
              </li>
            ))}
        </ul>
  
        <h3>Add a New Tournament</h3>
        <form onSubmit={addTournament}>
          <label id = "editforms">
            <input
                type="text"
                style = {{width:'175px'}}
                placeholder="Tournament Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
          </label>
          <label id = "editforms">
            <input
                placeholder = "Start Date"
                type = "text"
                style = {{width:'175px'}}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
          </label>
          <label id = "editforms">
            <input
                placeholder = "End Date"
                type = "text"
                style = {{width:'175px'}}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
          </label>
          <label id = "editforms">
            <input
                type="text"
                style = {{width:'175px'}}
                placeholder="# of Rounds"
                value={numRounds}
                onChange={(e) => setNumRounds(e.target.value)}
                required
            />
          </label>
          <button type="submit">Add Tournament</button>
        </form>
        
        {/* To initialize tournament (# of rounds and # of matches)*/}
        {selectedTournament && (
        <div>
          <h2>{selectedTournament.name} - Bracket</h2>
          <Bracket data={selectedTournament.data} onUpdate = {addTournament} numRounds = {numRounds}/>
        </div>
      )}
      </div>
    );
}

export default Editjoin;