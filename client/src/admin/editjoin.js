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
    
          // Revalidate the SWR cache
          await mutate('/api/tournaments');
        } catch (err) {
          setErrorMessage(err.message);
        }
    };
    
    //HERE, I want to have it so that I let the user select options for the bracket: number of rounds specifically, which will allow to make the bracket
    //Maybe, just have the names be set automatically for each of the rounds depending on how many rounds
    const addTournament = async (e) => {
      e.preventDefault();
    
      const newTournament = {
        id: uuidv4(),
        name,
        startDate,
        endDate,
        numRounds,
        data: initializeEmptyBracket(numRounds) // Initialize bracket structure
      };
    
      // Update the local data
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
    
      // Revalidate the SWR cache
      mutate('/api/tournaments');
    
      // Reset form fields
      setName('');
      setStartDate('');
      setEndDate('');
      setNumRounds('');
    };
    
    // Function to initialize empty bracket based on numRounds
    const initializeEmptyBracket = (numRounds) => {
      const rounds = [];
      for (let i = 0; i < numRounds; i++) {
        rounds.push({ name: `Round ${i + 1}` }); // Adjust as per your round naming convention
      }
    
      const bracketData = {
        rounds: rounds,
        matches: [], // Initialize empty matches array
        contestants: {} // Initialize empty contestants object
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
                  <Link to = {`/edittournament/${tournament.id}`} id = "edittournaments"> 
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
          <Bracket data={selectedTournament.data} onUpdate = {addTournament}/>
        </div>
      )}
      </div>
    );
}

export default Editjoin;