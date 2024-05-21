import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './components/Form';
import Content from './components/Content';
import EditScheda from './components/EditScheda';
import Navbar from './components/Navbar';
import FormComponent from './components/FormComponent';
import AllSchede from './components/AllSchede'; // Importa il nuovo componente per visualizzare tutte le schede
import './styles/App.css';

function App() {
    return (
        <ConfigProvider>
            <Router>
                <div>
                    <Navbar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/add-scheda" element={<Form />} />
                            <Route path="/" element={<Content />} />
                            <Route path="/edit-scheda" element={<EditScheda />} />
                            <Route path="/edit-form" element={<FormComponent />} />
                            <Route path="/all-schede" element={<AllSchede />} /> {/* Nuovo percorso per visualizzare tutte le schede */}
                        </Routes>
                    </div>
                </div>
            </Router>
        </ConfigProvider>
    );
}

export default App;
