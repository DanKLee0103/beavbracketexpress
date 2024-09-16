//Navigation bar
import React from 'react';
import { Button } from "antd";
import { Link } from 'react-router-dom';
import '../App.css';

function Navigation() {
  return (
    <nav className="App-nav">
        <Link to="/">
            <Button type = 'primary' id = 'navbar'>Homepage</Button>
        </Link>
        <Link to="/contact">
            <Button type = 'primary' id = 'navbar'>Contact</Button>
        </Link>
    </nav>
  );
}

export default Navigation;