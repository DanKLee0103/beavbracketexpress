import React, {useState} from 'react';
import '../App.css';
import '../components/tab.css'
import Tourtabs from '../components/tourtabs';

//we want to have this and schedule so that it updates automatically based on the information editted on each bracket
function PoolPlay(){



    return (
        <div>Poolplay page
            <Tourtabs/>
        </div>
    )
}

export default PoolPlay;