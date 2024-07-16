import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import Homepage from './client/homepage';
import Jointour from './client/jointour';
import Editjoin from './admin/editjoin';
import Admin from './admin/admin'
import Edittour from './admin/edittour';
import Contact from './client/contact';
import Clienttour from './client/clienttour';
import Schedule from './admin/schedule';
import PoolPlay from './admin/poolplay';
import EditBronzeBracket from './admin/editbronzebracket';
import EditSilverBracket from './admin/editsilverbracket';
import EditGoldBracket from './admin/editgoldbracket';

function App() {
  return (
    <div className="App">
      <Router>
        <header class = "App-header">
          <h1><Link to = "/" id = "navreq"><div>Beaver Brackets</div></Link></h1>
        </header>
        <Navigation/>
        <Routes>
          {/* For admin side */}
          <Route path = "/editjoin" element = {<Editjoin/>}/>
          <Route path = "/admin" element = {<Admin/>}/>
          <Route path = "/edittournament/:id" element = {<Edittour/>}/>
          <Route path= "/edittournament/schedule/:id" element={<Schedule/>} />
          <Route path= "/edittournament/pool-play/:id" element={<PoolPlay/>} />
          <Route path= "/edittournament/bronze/:id" element={<EditBronzeBracket/>} />
          <Route path= "/edittournament/silver/:id" element={<EditSilverBracket/>} />
          <Route path= "/edittournament/gold/:id" element={<EditGoldBracket/>} />
          {/* For clients */}
          <Route path = "/" element = {<Homepage/>}/>
          <Route path = "/jointour" element = {<Jointour/>} id = "navreq"/>
          <Route path = "/contact" element = {<Contact/>} id = "navreq"/>
          <Route path = "/clienttour/:id" element = {<Clienttour/>}/> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;