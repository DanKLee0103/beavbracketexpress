import React, { useState } from 'react';
import { TiDelete } from "react-icons/ti";
import '../App.css';

const BracketForm = ({ numRounds, onSubmit }) => {
  const [rounds, setRounds] = useState(Array.from({ length: numRounds }, () => ({ name: '', contestant1: '', contestant2: '', score1: '', score2: '', winner: '' })));
  const [roundName, setRoundName] = useState('');
  const [contestant1, setContestant1] = useState('');
  const [contestant2, setContestant2] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [winner, setWinner] = useState('');

  //For submitting new data
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      rounds: [
        { name: roundName || "TBD"}
      ],
      matches: [
        {
          roundIndex: 0,
          order: 0,
          sides: [
            {
              contestantId: "1",
              scores: [
                {
                  mainScore: score1 || "TBD",
                  isWinner: winner === contestant1 || "TBD"
                }
              ],
              isWinner: winner === contestant1 || "TBD"
            },
            {
              contestantId: "2",
              scores: [
                {
                  mainScore: score2 || "TBD",
                  isWinner: winner === contestant2 || "TBD"
                }
              ],
              isWinner: winner === contestant2 || "TBD"
            }
          ]
        }
      ],
      contestants: {
        1: { players: [{ title: contestant1 || "TBD"}] },
        2: { players: [{ title: contestant2 || "TBD"}] }
      }
    };
    onSubmit(data);
  };

  return (
    <div className = "formwrapper">
      <TiDelete class = "close"/>
      <form onSubmit={handleSubmit} id = "bracketform">
        <div>
          <label id = "bracketlabel">Round Name:</label>
          <input type="text" value={roundName} onChange={(e) => setRoundName(e.target.value)} required = "true"/>
        </div>
        <div>
          <label id = "bracketlabel">Contestant 1:</label>
          <input type="text" value={contestant1} onChange={(e) => setContestant1(e.target.value)} required = "true"/>
        </div>
        <div>
          <label id = "bracketlabel">Contestant 2:</label>
          <input type="text" value={contestant2} onChange={(e) => setContestant2(e.target.value)} required = "true"/>
        </div>
        <div>
          <label id = "bracketlabel">Score 1:</label>
          <input type="text" value={score1} onChange={(e) => setScore1(e.target.value)} />
        </div>
        <div>
          <label id = "bracketlabel">Score 2:</label>
          <input type="text" value={score2} onChange={(e) => setScore2(e.target.value)} />
        </div>
        <div>
          Select Winner<br/>
          <input type="radio" name = "winner" value={score1} onChange={(e) => setWinner(contestant1)} />{contestant1 || "TBD"}<br/>
          <input type="radio" name = "winner" value={score2} onChange={(e) => setWinner(contestant2)} />{contestant2 || "TBD"}<br/>
          <input type="radio" name = "winner" onChange={(e) => setWinner(contestant1)} />{"TBD (Winner will be announced later)"}<br/>
        </div>
        <button type="submit">Save Bracket</button>
      </form>
    </div>
  );
};

export default BracketForm;