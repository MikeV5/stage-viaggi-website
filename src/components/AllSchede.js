import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Spin } from "antd";
import { db } from './firebase';
import { ref, get } from 'firebase/database';

const AllSchede = () => {
    const [schede, setSchede] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const schedeRef = ref(db, 'schede');
        get(schedeRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = [];
                    snapshot.forEach((childSnapshot) => {
                        const id = childSnapshot.key;
                        const scheda = childSnapshot.val();
                        data.push({
                            id,
                            ...scheda
                        });
                    });

                    // Ordina le schede in ordine alfabetico in base all'autore
                    data.sort((a, b) => a.autore.localeCompare(b.autore));

                    setSchede(data);
                } else {
                    console.log("Nessuna scheda trovata nel database");
                }
            })
            .catch((error) => {
                console.error("Errore nel recupero delle schede:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {schede.length === 0 ? (
                <>
                    <h1>Non ci sono schede disponibili...</h1>
                    <p><Link to="/add-scheda">Carica una nuova scheda</Link>.</p>
                </>
            ) : (
                <>
                    <h1>Tutte le schede</h1>
                    <Row gutter={[16, 16]}>
                        {schede.map((scheda) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={scheda.id}>
                                <Link to={`/edit-scheda?scheda=${scheda.id}`}>
                                    <Card title={scheda.titolo}>
                                        <p>{scheda.autore}</p>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
}

export default AllSchede;
