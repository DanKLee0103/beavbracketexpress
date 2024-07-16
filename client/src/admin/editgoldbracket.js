import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import MakeBracket from '../components/bracket';
import Tourtabs from '../components/tourtabs';
// import '../components/tab.css';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
});

function EditGoldBracket() {
  const { id } = useParams();
  const { data: tournament, error: tournamentError } = useSWR(`/api/tournaments/${id}`, fetcher);
  const [errorMessage, setErrorMessage] = useState('');

  if (tournamentError) return <div>Failed to load data</div>;
  if (!tournament) return <div>Loading...</div>;

  const updateBracketData = async (newData) => {
    try {
      const updatedTournament = {
        ...tournament,
        goldBracket: newData
      };

      const response = await fetch(`/api/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTournament),
      });

      if (!response.ok) {
        throw new Error('Failed to update bracket');
      }

      const updatedData = await response.json();
      mutate(`/api/tournaments/${id}`, updatedData, false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h1>{tournament.name} - Gold Bracket</h1>
      {tournament.goldBracket && <MakeBracket data={tournament.goldBracket} onUpdate={updateBracketData} />}
      {errorMessage && <div className="error">{errorMessage}</div>}
      <Tourtabs/>
    </div>
  );
}

export default EditGoldBracket;
