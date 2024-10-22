import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/all-schede">Schede</Link></li>
                <li><Link to="/add-scheda">Aggiungi Scheda</Link></li>
                <li><Link to="/login">LogIn</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;