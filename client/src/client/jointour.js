//For joining the tournament
import React, {useState} from 'react';
import useSWR from 'swr';
import '../App.css'
import {Link} from 'react-router-dom'

const fetcher = (url) => fetch(url).then((res) => res.json());

function Jointour(){
    const { data: tournaments, error, mutate } = useSWR('/api/tournaments', fetcher);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
  
    if (error) return <div>Failed to load tournaments</div>;
    if (!tournaments) return <div>Loading...</div>;
  
    const addTournament = async (e) => {
      e.preventDefault();
  
      const newTournament = { name, date };
      //update the local data
      mutate(
        '/api/tournaments',
        [...tournaments, newTournament].sort((a, b) => new Date(a.date) - new Date(b.date)),
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
  
      //revalidate the SWR cache
      mutate('/api/tournaments');
    };
  
    return (
      <div>
        <h1>Want To Join A Tournament?</h1>
        <h3>Click on any of the tournaments below!</h3>
        <ul>
          {Array.isArray(tournaments) && tournaments
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((tournament) => (
              <li id = "tournaments">
                <Link to = {`/clienttour/${tournament.id}`} id = "edittournaments"> 
                      {tournament.name} - ({new Date(tournament.startDate).toLocaleDateString('en-US', {timeZone: 'UTC'})} - 
                      {new Date(tournament.endDate).toLocaleDateString('en-US', {timeZone: 'UTC'})})
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );
}
  
export default Jointour;