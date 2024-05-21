import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from "antd";
import { db } from './firebase';
import { ref, get } from 'firebase/database';

const AllSchede = () => {
    const [schede, setSchede] = useState([]);

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
                    setSchede(data);
                } else {
                    console.log("Nessuna scheda trovata nel database");
                }
            })
            .catch((error) => {
                console.error("Errore nel recupero delle schede:", error);
            });
    }, []);

    return (
        <div>
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
        </div>
    );
}

export default AllSchede;
