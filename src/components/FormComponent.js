import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { db } from './firebase';
import { ref, get, set, push } from 'firebase/database';

import { Row, Col, Card, Form, Input, Button, Space, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import '../styles/Form.css';

const FormComponent = () => {
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Inizializza useNavigate
    const idScheda = searchParams.get("scheda");
    const [scheda, setScheda] = useState(null);

    useEffect(() => {
        if (idScheda) {
            const schedeRef = ref(db, `schede/${idScheda}`);
            get(schedeRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setScheda(data);
                        form.setFieldsValue(data);
                    } else {
                        console.log("Nessuna scheda trovata nel database");
                    }
                })
                .catch((error) => {
                    console.error("Errore nel recupero delle schede:", error);
                });
        }
    }, [idScheda, form]);

    const handleSubmit = (values) => {
        const schedaRef = idScheda ? ref(db, `schede/${idScheda}`) : push(ref(db, 'schede'));
        set(schedaRef, values)
            .then(() => {
                alert('Dati salvati nel database!');
                navigate('/'); // Reindirizza alla homepage dopo l'alert
            })
            .catch((error) => {
                console.error('Errore nel salvataggio dei dati:', error);
            });
    };

    return (
        <Row justify="center">
            <Col xs={24} md={12}>
                <Card title="Inserire Informazioni">
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Titolo"
                            name="titolo"
                            rules={[{ required: true, message: 'Inserire titolo!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Autore"
                            name="autore"
                            rules={[{ required: true, message: 'Inserire autore!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Testo"
                            name="testo"
                            rules={[{ required: true, message: 'Inserire testo!' }]}
                        >
                            <Input.TextArea rows={10} />
                        </Form.Item>
                        <Divider />
                        <Form.List name="tags">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                rules={[{ required: true, message: 'Inserisci il tag!' }]}
                                            >
                                                <Input placeholder="Tag" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Aggiungi Tag
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item>
                            <Button type="primary" block onClick={() => form.submit()}>
                                Salva
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default FormComponent;
