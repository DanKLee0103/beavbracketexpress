import { Button } from "antd";
import beavimage from "./images/tennis-beaver-2.png";
import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation';
import Homepage from './client/homepage';
import Jointour from './client/jointour';
import Addtour from './admin/addtour';
import AddEvent from './admin/addevent';
import VerifyTime from "./admin/verifytime";

function App() {
  return (
    <div className="App">
      <Router>
        <header class = "App-header">
              <div className="header-container">
                <img className="beaver-image left" src={beavimage} alt="Beaver Image" />
                <h1 id="header-link">
                  <Link to="/" id="navreq">Beaver Brackets</Link>
                </h1>
                <img className="beaver-image right" src={beavimage} alt="Beaver Image" />
              </div>
              <head><Navigation/></head>
        </header> 
        <main class="App-main">   
        <Routes>
          {/* For admin side */}
          {/* <Route path = "/editjoin" element = {<Editjoin/>}/>
          <Route path = "/admin" element = {<Admin/>}/>
          <Route path = "/edittournament/:id" element = {<Edittour/>}/>
          <Route path= "/edittournament/schedule/:id" element={<Schedule/>} />
          <Route path= "/edittournament/pool-play/:id" element={<PoolPlay/>} />
          <Route path= "/edittournament/bronze/:id" element={<EditBronzeBracket/>} />
          <Route path= "/edittournament/silver/:id" element={<EditSilverBracket/>} />
          <Route path= "/edittournament/gold/:id" element={<EditGoldBracket/>} /> */}
          {/* For clients */}
           <Route path = "/" element = {<Homepage/>}/>
           <Route path = "/jointour" element = {<Jointour/>} id = "navreq"/>
           <Route path = "/addtour/:id/:tab" element = {<Addtour/>} id = "navreq"/>
           <Route path = "/addevent/:id" element = {<AddEvent/>}/>
           <Route path = "/verifytime/:id" element = {<VerifyTime/>}/>
          {/* // <Route path = "/contact" element = {<Contact/>} id = "navreq"/>
          // <Route path = "/clienttour/:id" element = {<Clienttour/>}/>  */}
        </Routes>
        </main>    
        <footer class = "App-footer"><h1><Link to = "/" id = "navreq">Beaver Brackets</Link></h1> </footer>
      </Router>
    </div>
  );
}

export default App;