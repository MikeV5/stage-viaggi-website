import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Input, Alert, Typography } from "antd";
import { db } from './firebase';
import { ref, get } from 'firebase/database';
import logo from '../styles/logo_sito.jpg';  // Importa il logo

const { Title } = Typography;

const Content = () => {
    const [cercato, setCercato] = useState(false);
    const [schede, setSchede] = useState([]);
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        let { tags } = values;
        tags = tags.toLowerCase(); // Converti le chiavi di ricerca in minuscolo
        const chiaviCercate = tags.split(" ").filter((val) => val);

        const schedeRef = ref(db, 'schede');
        get(schedeRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = [];
                    snapshot.forEach((childSnapshot) => {
                        const id = childSnapshot.key;
                        const scheda = childSnapshot.val();
                        const { tags = [] } = scheda;

                        if (!chiaviCercate.every((chiaveCercata) => {
                            return tags.some((tag) => tag.toLowerCase() === chiaveCercata);
                        }))
                            return;

                        data.push({
                            id, 
                            ...scheda
                        });
                    });
                    setCercato(true);
                    setSchede(data);
                } else {
                    console.log("Nessuna scheda trovata nel database");
                }
            })
            .catch((error) => {
                console.error("Errore nel recupero delle schede:", error);
            });
    }

    return (
        <>
        <Row justify="center">
            <Col xs={24} md={12}>
                <div style={{ textAlign: 'center' }}>
                    <img src={logo} alt="Logo del sito" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <Card>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label=""
                            name="tags"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Inserire chiave di ricerca!',
                                },
                            ]}
                        >
                            <Input 
                                placeholder="Inserire Tags"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" block onClick={(e) => {
                                form.submit(e);
                            }}>
                                Cerca
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
        {cercato &&
        <Row justify="center" style={{ marginTop: 16}}>
            <Col xs={24} md={12}>
                {!schede.length
                ?
                <Alert message="Nessun risultato trovato" type="error" />
                :
                    <>
                        <h3>
                            Risultati ricerca:
                        </h3>
                        {schede.map((scheda, index) => {
                            const { id, titolo, autore } = scheda;
                            return (
                                <Link
                                    key={index}
                                    to={`/edit-scheda?scheda=${id}`}
                                >
                                    <Card
                                        title={titolo}
                                        hoverable
                                        style={{
                                            marginBottom: 8
                                        }}
                                    >
                                        {autore}
                                    </Card>
                                </Link>
                            )
                        })}
                    </>
                }
            </Col>
        </Row>
        }
        <style jsx>{`
            @media (max-width: 768px) {
                img {
                    max-width: 100%;
                    height: auto;
                }
            }
            @media (max-width: 480px) {
                img {
                    max-width: 100%;
                    height: auto;
                }
            }
        `}</style>
        </>
    )
};

export default Content;
