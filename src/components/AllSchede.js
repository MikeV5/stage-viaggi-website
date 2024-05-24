import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Spin, Button } from "antd";
import { db } from './firebase';
import { ref, get } from 'firebase/database';

const AllSchede = () => {
    const [schede, setSchede] = useState([]);
    const [filteredSchede, setFilteredSchede] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

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
                    setFilteredSchede(data);
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

    useEffect(() => {
        if (filter) {
            // Filtra le schede in base alla lettera iniziale dell'autore
            setFilteredSchede(schede.filter(scheda => {
                const firstLetter = scheda.autore.charAt(0).toUpperCase();
                return filter.split('').includes(firstLetter);
            }));
        } else {
            setFilteredSchede(schede);
        }
    }, [filter, schede]);

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
                    <div style={{ marginBottom: 20 }}>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'GH', 'IJK', 'L', 'M', 'N', 'O', 'PQ', 'R', 'S', 'T', 'UV', 'WX', 'YZ'].map(group => (
                            <Button
                                key={group}
                                type={filter === group ? 'primary' : 'default'}
                                onClick={() => setFilter(group)}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                {group}
                            </Button>
                        ))}
                        <Button
                            type={!filter ? 'primary' : 'default'}
                            onClick={() => setFilter('')}
                            style={{ marginLeft: 8 }}
                        >
                            Tutti
                        </Button>
                    </div>
                    <Row gutter={[16, 16]}>
                        {filteredSchede.map((scheda) => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={scheda.id}>
                                <Link to={`/edit-scheda?scheda=${scheda.id}`}>
                                    <Card title={scheda.autore}>
                                        <p>{scheda.titolo}</p>
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
