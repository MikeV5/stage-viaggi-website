import React, { useState, useEffect } from 'react';
import { Button, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom'; 
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation(); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        const auth = getAuth();
        auth.signOut().then(() => {
            console.log("Logout effettuato");
            setIsLoggedIn(false);
        }).catch((error) => {
            console.error("Errore durante il logout: ", error);
        });
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); 
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="navbar-container">
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                className="navbar-menu"
            >
                <Menu.Item key="1">
                    <Link to="/">Home</Link>
                </Menu.Item>
                {isLoggedIn && (
                    <Menu.Item key="2">
                        <Link to="/add-scheda">Aggiungi Scheda</Link>
                    </Menu.Item>
                )}
                <Menu.Item key="3">
                    <Link to="/all-schede">Tutte le Schede</Link>
                </Menu.Item>
            </Menu>

            <div className="navbar-buttons">
                {isLoggedIn ? (
                    <Button type="primary" onClick={handleLogout} style={{ marginRight: '20px'}}>
                        Logout
                    </Button>
            
                ) : (
                    location.pathname !== '/login' && (
                        <Button type="default" style={{ marginRight: '20px'}}>
                            <Link to="/login">Accedi</Link>
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default Navbar;
