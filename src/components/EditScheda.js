import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from "antd";

import { db } from './firebase';
import { ref, get } from 'firebase/database';

const EditScheda = () => {
    const [scheda, setScheda] = useState();
    const [searchParams] = useSearchParams();
    const idScheda = searchParams.get("scheda");
    const navigate = useNavigate();

    useEffect(() => {
        const schedeRef = ref(db, 'schede');
        get(schedeRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const id = childSnapshot.key;
                        if (id !== idScheda) return;

                        const scheda = childSnapshot.val();
                        setScheda(scheda);
                    });
                } else {
                    console.log("Nessuna scheda trovata nel database");
                }
            })
            .catch((error) => {
                console.error("Errore nel recupero delle schede:", error);
            });
    }, [idScheda]);

    if (!scheda) {
        return <></>;
    }

    const handleEditClick = () => {
        navigate(`/edit-form?scheda=${idScheda}`);
    };

    return (
        <Row justify="center">
            <Col xs={24} md={12}>
                <Card
                    title={scheda.titolo}
                    style={{
                        body: {
                            padding: 8
                        }
                    }}
                >
                    <p style={{ marginTop: 0 }}>
                        {scheda.testo}
                    </p>
                </Card>
                <Button style={{ marginTop: 16 }} onClick={handleEditClick}>
                    Modifica
                </Button>
            </Col>
        </Row>
    );
};

export default EditScheda;
