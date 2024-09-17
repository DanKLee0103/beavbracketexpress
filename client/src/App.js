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
import RemoveEvent from "./admin/removeEvent";
import VerifyTime from "./admin/verifytime";
// import Editjoin from './admin/editjoin';
// import Admin from './admin/admin'
// import Edittour from './admin/edittour';
// import Contact from './client/contact';
// import Clienttour from './client/clienttour';
// import Schedule from './admin/schedule';
// import PoolPlay from './admin/poolplay';
// import EditBronzeBracket from './admin/editbronzebracket';
// import EditSilverBracket from './admin/editsilverbracket';
// import EditGoldBracket from './admin/editgoldbracket';

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
           <Route path = "/removeEvent/:id" element = {<RemoveEvent/>}/>
           <Route path = "/verifytime/:id" element = {<VerifyTime/>}/>
          {/* // <Route path = "/contact" element = {<Contact/>} id = "navreq"/>
          // <Route path = "/clienttour/:id" element = {<Clienttour/>}/>  */}
        </Routes>
        <footer class = "App-footer"><h1><Link to = "/" id = "navreq">Beaver Brackets</Link></h1> </footer>
      </Router>
    </div>
  );
}

export default App;