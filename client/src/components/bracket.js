import React, { useRef, useState, useEffect } from 'react';
import { createBracket } from 'bracketry';
import BracketForm from './bracketform'; 

const MakeBracket = ({ data, onUpdate }) => {
  const bracketRef = useRef(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  // const existingSeeds = Object.values(data.contestants).map(contestant => contestant.entryStatus);
  useEffect(() => {
    if (bracketRef.current && data) {
      //Clear existing content to avoid duplicate brackets
      while (bracketRef.current.firstChild) {
        bracketRef.current.removeChild(bracketRef.current.firstChild);
      }

      // got rid of innerHtml method causing DOM issues and now using a more
      // original approach above

      const options = {
        onMatchClick: (match) => {
          setSelectedMatch(match);
        },
      };

      // Create or update the bracket
      createBracket(data, bracketRef.current, { ...options, useClassicalLayout: true });
    }
  }, [data]);

  // const matchContestants = selectedMatch
  //   ? {
  //       contestant1: data.contestants[selectedMatch.sides[0].contestantId]?.players[0]?.title,
  //       contestant2: data.contestants[selectedMatch.sides[1].contestantId]?.players[0]?.title,
  //     }
  //   : null;

  const handleSubmit = (updatedMatch, updatedContestants, updatedMatches) => {
    // const newData = { ...data };
    // newData.matches = newData.matches.map((match) =>
    //   match.roundIndex === updatedMatch.roundIndex && match.order === updatedMatch.order ? updatedMatch : match
    // );
    // newData.contestants = updatedContestants;
    // onUpdate(newData);
    // setSelectedMatch(null);
    const newData = { ...data };
    newData.matches = updatedMatches;
    newData.contestants = updatedContestants;
    onUpdate(newData);
    setSelectedMatch(null);
  };

  const handleClose = () => {
    setSelectedMatch(null); // closes the modal
  };

  return (
    <div>
      <div ref={bracketRef} id="bracket" />
      {selectedMatch && <BracketForm contestants = {data.contestants} match={selectedMatch} onSubmit={handleSubmit} onClose = {handleClose} matches={data.matches} />}
      <form>
        {/* Create a form to change the number of rounds */}
      </form>
    </div>
  );
};

export default MakeBracket;