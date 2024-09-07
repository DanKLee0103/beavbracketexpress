import React, { useState } from 'react';
import { TiDelete } from "react-icons/ti";
import '../App.css';
import './modal.css';
// import { matchRoutes } from 'react-router-dom';

const BracketForm = ({ contestants, match, onSubmit, onClose, matches }) => {
  const [contestant1Name, setContestant1Name] = useState(contestants[match.sides[0].contestantId].players[0].title);
  const [contestant2Name, setContestant2Name] = useState(contestants[match.sides[1].contestantId].players[0].title);
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
  const [entry1, setEntry1] = useState(contestants[match.sides[0].contestantId].entryStatus);
  const [entry2, setEntry2] = useState(contestants[match.sides[1].contestantId].entryStatus);
  const clearEntry1 = () => setEntry1("");
  const clearEntry2 = () => setEntry2("");

  // const updateNextRoundMatch = (matches, updatedMatch) => {
  //   // Find the current match index
  //   const currentMatchIndex = matches.findIndex(
  //     (match) => match.roundIndex === updatedMatch.roundIndex && match.order === updatedMatch.order
  //   );
  
  //   // If it's the last round, there's no next round to update
  //   if (currentMatchIndex === -1 || updatedMatch.roundIndex === matches.length - 1) {
  //     return matches;
  //   }
  
  //   // Calculate the next round index and order
  //   const nextRoundIndex = updatedMatch.roundIndex + 1;
  //   const nextMatchOrder = Math.floor(updatedMatch.order / 2);
  
  //   // Find the next match
  //   const nextMatchIndex = matches.findIndex(
  //     (match) => match.roundIndex === nextRoundIndex && match.order === nextMatchOrder
  //   );
  
  //   if (nextMatchIndex === -1) {
  //     return matches;
  //   }
  
  //   const nextMatch = matches[nextMatchIndex];
  
  //   // Determine which side of the next match to update
  //   const sideToUpdate = updatedMatch.order % 2 === 0 ? 0 : 1;
  
  //   // Update the contestantId and scores for the next match
  //   const updatedNextMatch = {
  //     ...nextMatch,
  //     sides: nextMatch.sides.map((side, index) => {
  //       if (index === sideToUpdate) {
  //         return {
  //           ...side,
  //           contestantId: updatedMatch.sides[0].isWinner ? updatedMatch.sides[0].contestantId : updatedMatch.sides[1].contestantId,
  //           scores: side.scores.map(score => ({ ...score, mainScore: "TBD", subscore: "TBD" })),
  //           isWinner: false
  //         };
  //       }
  //       return side;
  //     }),
  //   };
  
    // Replace the next match in the matches array
  //   const updatedMatches = matches.map((match, index) =>
  //     index === nextMatchIndex ? updatedNextMatch : match
  //   );
  
  //   return updatedMatches;
  // };  
  const seeds = []; //to make sure no duplicate seeds
  const updateNextRoundMatch = (updatedMatch, allMatches) => {
    const nextRoundIndex = updatedMatch.roundIndex + 1;
    const matchOrderInNextRound = Math.floor(updatedMatch.order / 2);

    const nextMatch = allMatches.find(
      (m) => m.roundIndex === nextRoundIndex && m.order === matchOrderInNextRound
    );

    if (nextMatch) {
      nextMatch.sides = nextMatch.sides || [];
    // nextMatch.sides[sideIndexToUpdate].contestantId = updatedMatch.sides.find(side => side.isWinner).contestantId;
      const sideIndexToUpdate = updatedMatch.order % 2 === 0 ? 0 : 1;
      nextMatch.sides[sideIndexToUpdate] = nextMatch.sides[sideIndexToUpdate] || {};//initialization with {} is required since skipped for latter rounds
      nextMatch.sides[sideIndexToUpdate].contestantId = winner;
      nextMatch.sides[sideIndexToUpdate].scores = [{ mainScore: "", subscore: "" }, { mainScore: "", subscore: "" }, { mainScore: "", subscore: "" }]
      nextMatch.sides[sideIndexToUpdate].isWinner = false;
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (entry1 === entry2 && entry1.length > 0) {
      window.alert("Entry1 and Entry2 seeds cannot be the same!");
      return;
    }
  
    const matchContestantIds = [match.sides[0].contestantId, match.sides[1].contestantId];
    const otherContestantIds = Object.keys(contestants).filter(
      id => !matchContestantIds.includes(id)
    );
    const existingEntryStatuses = otherContestantIds.map(id => contestants[id].entryStatus);

    // const existingEntryStatuses = otherContestants.map(contestant => contestant.entryStatus);
  
    if (existingEntryStatuses.includes(entry1) && entry1 !== "") {
      window.alert(`Entry1 seed (${entry1}) has been taken by another player!`);
      return;
    }
  
    if (existingEntryStatuses.includes(entry2) && entry2 !== "") {
      window.alert(`Entry2 seed (${entry2}) has been taken by another player!`);
      return;
    }

    const updatedMatch = {
      ...match,
      sides: [
        {
          contestantId: match.sides[0].contestantId,
          scores: [
            { mainScore: score1a || "", isWinner: winner === match.sides[0].contestantId },
            { mainScore: score1b || "", isWinner: winner === match.sides[0].contestantId },
            { mainScore: score1c || "", isWinner: winner === match.sides[0].contestantId }
          ],
          isWinner: winner === match.sides[0].contestantId
        },
        {
          contestantId: match.sides[1].contestantId,
          scores: [
            { mainScore: score2a || "", isWinner: winner === match.sides[1].contestantId },
            { mainScore: score2b || "", isWinner: winner === match.sides[1].contestantId },
            { mainScore: score2c || "", isWinner: winner === match.sides[1].contestantId }
          ],
          isWinner: winner === match.sides[1].contestantId
        }
      ]
    };

    const updatedContestants = {
      ...contestants,
      [match.sides[0].contestantId]: {
        ...contestants[match.sides[0].contestantId],
        entryStatus: entry1 || "",
        players: [
          {
            ...contestants[match.sides[0].contestantId].players[0],
            title: contestant1Name
          }
        ]
      },
      [match.sides[1].contestantId]: {
        ...contestants[match.sides[1].contestantId],
        entryStatus: entry2 || "",
        players: [
          {
            ...contestants[match.sides[1].contestantId].players[0],
            title: contestant2Name
          }
        ]
      }
    };

    const updatedMatches = matches.map((m) =>
      m.roundIndex === updatedMatch.roundIndex && m.order === updatedMatch.order ? updatedMatch : m
    );

    updateNextRoundMatch(updatedMatch, updatedMatches);
    onSubmit(updatedMatch, updatedContestants, updatedMatches);
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
            <label id="bracketlabelscore">Seed (Entry1):</label>
            <input style = {{width:'20px'}} type="text" value={entry1} onChange={(e) => setEntry1(e.target.value)} />
            {/* <button type="button" onClick={clearEntry1}>Clear</button> */}
          </div>
          <div>
            <label id="bracketlabel">Contestant 2:</label>
            <input type="text" value={contestant2Name} onChange={(e) => setContestant2Name(e.target.value)} required />
          </div>
          <div>
            <label id="bracketlabelscore">Seed (Entry2):</label>
            <input style = {{width:'20px'}} type="text" value={entry2} onChange={(e) => setEntry2(e.target.value)} />
            {/* <button type="button" onClick={clearEntry2}>Clear</button> */}
          </div>
          <div>
            <label id="bracketlabelscore">Score 1:</label>
            <input style = {{width:'20px'}} type="text" value={score1a} onChange={(e) => setScore1a(e.target.value)} />
            <input style = {{width:'20px'}} type="text" value={score1b} onChange={(e) => setScore1b(e.target.value)} />
            <input style = {{width:'20px'}} type="text" value={score1c} onChange={(e) => setScore1c(e.target.value)} />
          </div>
          <div>
            <label id="bracketlabelscore">Score 2:</label>
            <input style = {{width:'20px'}} type="text" value={score2a} onChange={(e) => setScore2a(e.target.value)} />
            <input style = {{width:'20px'}} type="text" value={score2b} onChange={(e) => setScore2b(e.target.value)} />
            <input style = {{width:'20px'}} type="text" value={score2c} onChange={(e) => setScore2c(e.target.value)} />
          </div>
          <div>
            Select Winner<br/>
            <input type="radio" name="winner" onChange={() => setWinner(match.sides[0].contestantId)} checked={winner === match.sides[0].contestantId} />{contestant1Name || "TBD"}<br/>
            <input type="radio" name="winner" onChange={() => setWinner(match.sides[1].contestantId)} checked={winner === match.sides[1].contestantId} />{contestant2Name || "TBD"}<br/>
            {/* <input type="radio" name="winner" onChange={() => setWinner(null)}/>{"TBD (Winner will be announced later)"}<br/> */}
          </div>
          <button type="submit">Save Bracket</button>
        </form>
      </div>
    </div>
  );
};

export default BracketForm;