//Navigation bar
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navigation() {
  return (
    <nav className="App-nav">
        <Link to="/">
            <button>Homepage</button>
        </Link>
        <Link to="/jointour">
            <button>Join a tournament</button>
        </Link>
        <Link to="/contact">
            <button>Contact</button>
        </Link>
    </nav>
  );
}

export default Navigation;