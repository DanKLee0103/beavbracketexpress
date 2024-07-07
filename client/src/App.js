import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import Homepage from './pages/homepage';
import Jointour from './pages/jointour';
import Editjoin from './admin/editjoin';
import Admin from './admin/admin'
import Edittour from './admin/edittour';
import Contact from './pages/contact';
import Clienttour from './pages/clienttour';

function App() {
  return (
    <div className="App">
      <Router>
        <header class = "App-header">
          <h1><Link to = "/" id = "navreq"><div>Beaver Brackets</div></Link></h1>
        </header>
        <Navigation/>
        <Routes>
          <Route path = "/" element = {<Homepage/>}/>
          <Route path = "/editjoin" element = {<Editjoin/>}/>
          <Route path = "/admin" element = {<Admin/>}/>
          <Route path = "/edittournament/:id" element = {<Edittour/>}/>
          <Route path = "/jointour" element = {<Jointour/>} id = "navreq"/>
          <Route path = "/contact" element = {<Contact/>} id = "navreq"/>
          <Route path = "/clienttour/:id" element = {<Clienttour/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;