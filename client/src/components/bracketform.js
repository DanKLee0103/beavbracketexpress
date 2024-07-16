import React, { useState } from 'react';
import { TiDelete } from "react-icons/ti";
import '../App.css';
import './modal.css';

const BracketForm = ({ contestants, match, onSubmit, onClose }) => {
  const [contestant1Name, setContestant1Name] = useState(contestants?.contestant1 || "Contestant 1");
  const [contestant2Name, setContestant2Name] = useState(contestants?.contestant2 || "Contestant 2");
  const [score1a, setScore1a] = useState(match.sides[0].scores[0].mainScore);
  const [score1b, setScore1b] = useState(match.sides[0].scores[1].mainScore);
  const [score1c, setScore1c] = useState(match.sides[0].scores[2].mainScore);
  const [score2a, setScore2a] = useState(match.sides[1].scores[0].mainScore);
  const [score2b, setScore2b] = useState(match.sides[1].scores[1].mainScore);
  const [score2c, setScore2c] = useState(match.sides[1].scores[2].mainScore);
  const [subscore1a, setsubScore1a] = useState(match.sides[0].scores[0].subScore);
  const [subscore1b, setsubScore1b] = useState(match.sides[0].scores[1].subScore);
  const [subscore1c, setsubScore1c] = useState(match.sides[0].scores[2].subScore);
  const [subscore2a, setsubScore2a] = useState(match.sides[1].scores[0].subScore);
  const [subscore2b, setsubScore2b] = useState(match.sides[1].scores[1].subScore);
  const [subscore2c, setsubScore2c] = useState(match.sides[1].scores[2].subScore);
  const [winner, setWinner] = useState(match.sides[0].isWinner ? match.sides[0].contestantId : match.sides[1].contestantId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMatch = {
      ...match,
      sides: [
        {
          contestantId: match.sides[0].contestantId,
          scores: [
            { mainScore: score1a || "TBD", isWinner: winner === match.sides[0].contestantId },
            { mainScore: score1b || "TBD", isWinner: winner === match.sides[0].contestantId },
            { mainScore: score1c || "TBD", isWinner: winner === match.sides[0].contestantId }
          ],
          isWinner: winner === match.sides[0].contestantId
        },
        {
          contestantId: match.sides[1].contestantId,
          scores: [
            { mainScore: score2a || "TBD", isWinner: winner === match.sides[1].contestantId },
            { mainScore: score2b || "TBD", isWinner: winner === match.sides[1].contestantId },
            { mainScore: score2c || "TBD", isWinner: winner === match.sides[1].contestantId }
          ],
          isWinner: winner === match.sides[1].contestantId
        }
      ]
    };

    const updatedContestants = {
      ...contestants,
      [match.sides[0].contestantId]: { ...contestants[match.sides[0].contestantId].players[0].title = contestant1Name },
      [match.sides[1].contestantId]: { ...contestants[match.sides[1].contestantId].players[0].title = contestant2Name },
    };

    onSubmit(updatedMatch, updatedContestants);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <TiDelete className="close" onClick={onClose} />
        <form onSubmit={handleSubmit} id="bracketform" method="get">
          <div>
            <label id="bracketlabel">Contestant 1:</label>
            <input type="text" value={contestant1Name} onChange={(e) => setContestant1Name(e.target.value)} required />
          </div>
          <div>
            <label id="bracketlabel">Contestant 2:</label>
            <input type="text" value={contestant2Name} onChange={(e) => setContestant2Name(e.target.value)} required />
          </div>
          <div>
            <label id="bracketlabel">Score 1:</label>
            <input type="text" value={score1a} onChange={(e) => setScore1a(e.target.value)} />
            <input type="text" value={score1b} onChange={(e) => setScore1b(e.target.value)} />
            <input type="text" value={score1c} onChange={(e) => setScore1c(e.target.value)} />
          </div>
          <div>
            <label id="bracketlabel">Score 2:</label>
            <input type="text" value={score2a} onChange={(e) => setScore2a(e.target.value)} />
            <input type="text" value={score2b} onChange={(e) => setScore2b(e.target.value)} />
            <input type="text" value={score2c} onChange={(e) => setScore2c(e.target.value)} />
          </div>
          <div>
            Select Winner<br/>
            <input type="radio" name="winner" onChange={() => setWinner(match.sides[0].contestantId)} checked={winner === match.sides[0].contestantId} />{contestant1Name || "TBD"}<br/>
            <input type="radio" name="winner" onChange={() => setWinner(match.sides[1].contestantId)} checked={winner === match.sides[1].contestantId} />{contestant2Name || "TBD"}<br/>
            <input type="radio" name="winner" onChange={() => setWinner(null)}/>{"TBD (Winner will be announced later)"}<br/>
          </div>
          <button type="submit">Save Bracket</button>
        </form>
      </div>
    </div>
  );
};

export default BracketForm;
