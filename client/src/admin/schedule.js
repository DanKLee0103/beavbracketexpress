import React, {useState} from 'react';
import '../App.css';
import '../components/tab.css'
import Tourtabs from '../components/tourtabs';

//we want to have this and poolplay so that it updates automatically based on the information editted on each bracket
function Schedule(){



    return (
        <div>schedule page
            <Tourtabs/>
        </div>
    )
}

export default Schedule;