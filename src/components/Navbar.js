import React, { useState, useEffect } from 'react';
import { Button, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom'; // Importa useLocation
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importa getAuth e onAuthStateChanged

const Navbar = () => {
    const location = useLocation(); // Ottieni la posizione attuale
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        const auth = getAuth(); // Inizializza l'autenticazione di Firebase
        auth.signOut().then(() => {
            console.log("Logout effettuato");
            setIsLoggedIn(false); // Reset dello stato di login
        }).catch((error) => {
            console.error("Errore durante il logout: ", error);
        });
    };

    // Effetto per controllare lo stato di autenticazione
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Imposta isLoggedIn in base alla presenza dell'utente
        });
        return () => unsubscribe(); // Pulisci l'effetto all'unmount
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#001529' }}>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ flex: 1, justifyContent: 'flex-start', display: 'flex' }} // Modifica qui
            >
                <Menu.Item key="1">
                    <Link to="/">Home</Link>
                </Menu.Item>
                {/* Mostra il link "Aggiungi Scheda" solo se l'utente è loggato */}
                {isLoggedIn && (
                    <Menu.Item key="2">
                        <Link to="/add-scheda">Aggiungi Scheda</Link>
                    </Menu.Item>
                )}
                <Menu.Item key="3">
                    <Link to="/all-schede">Tutte le Schede</Link>
                </Menu.Item>
            </Menu>

            <div>
                {isLoggedIn ? (
                    <Button type="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    // Mostra il pulsante "Accedi" solo se non sei sulla pagina di login
                    location.pathname !== '/login' && (
                        <Button type="default">
                            <Link to="/login">Accedi</Link>
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default Navbar;
