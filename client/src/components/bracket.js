import { createBracket } from 'bracketry'; // Assuming bracketry has an update function
import '../App.css';
import React, { useEffect, useRef, useState } from 'react';
import BracketForm from './bracketform';
import Editjoin from '../admin/editjoin';

//MAKE A DEFAULT BRACKET (just make the number of rounds changeable inside the bracket page actually let's make a form for)
const MakeBracket = ({ data, onUpdate }) => {
  //want to use a reference not the actual bracket
  const bracketref = useRef();
  const [selectedMatch, setSelectedMatch] = useState(null);
  useEffect(() => {
    if (bracketref.current && data) {
      //Clear existing content to avoid duplicate brackets
      bracketref.current.innerHTML = '';

      const options = {
        onMatchClick: (match) => {
          setSelectedMatch(match);
        },
      }
      //Create or update the bracket
      createBracket(data, bracketref.current, { ...options, useClassicalLayout: true });//decide if i want to use classical layout later

    }
  }, [data]);

  const handleSubmit = (newData) => {
    onUpdate(newData);
    setSelectedMatch(null); //Close the form after submission
  };

  return (
    <div ref={bracketref} id="bracket">
      {selectedMatch && <BracketForm onSubmit={handleSubmit}/>}
      <form>
        {/* create a form to change number of rounds*/}
      </form>
    </div>

  );
};

export default MakeBracket;