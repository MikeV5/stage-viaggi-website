import React, { useEffect, useState } from 'react';     //Quando modifichi una scheda
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { ref, get, set, push } from 'firebase/database';
import { Row, Col, Card, Form, Input, Button, Space, Divider, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/Form.css';

const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const FormComponent = () => {
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const idScheda = searchParams.get("scheda");
    const [scheda, setScheda] = useState(null);
    const [autoreValue, setAutoreValue] = useState('');
    const [titoloValue, setTitoloValue] = useState('');
    const [textValue, setTextValue] = useState('');

    useEffect(() => {
        if (idScheda) {
            const schedeRef = ref(db, `schede/${idScheda}`);
            get(schedeRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setScheda(data);
                        form.setFieldsValue(data);
                        setAutoreValue(data.autore);
                        setTitoloValue(data.titolo);
                        setTextValue(data.testo);
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

        if (!stripHtmlTags(autoreValue) || !stripHtmlTags(titoloValue) || !stripHtmlTags(textValue)) {
            message.error('Assicurati di compilare tutti i campi.');
            return;
        }

        values.autore = autoreValue;
        values.titolo = titoloValue;
        values.testo = textValue;

        // Aggiungi la data di ultima modifica
        values.dataLastModifica = new Date().toISOString();

        const schedaRef = idScheda ? ref(db, `schede/${idScheda}`) : push(ref(db, 'schede'));
        set(schedaRef, values)
            .then(() => {
                alert('Dati salvati nel database!');
                //navigate('/');
                navigate(`/edit-scheda?scheda=${idScheda}`);
            })
            .catch((error) => {
                console.error('Errore nel salvataggio dei dati:', error);
            });
    };

    // Funzione di validazione personalizzata per campi vuoti
    const validateEmpty = (fieldName, value) => {
        if (!stripHtmlTags(value)) {
            return Promise.reject(`Inserire ${fieldName}!`);
        }
        return Promise.resolve();
    };

    // Regole di validazione personalizzate
    const rules = (fieldName) => [{
        validator: (_, value) => validateEmpty(fieldName, value)
    }];

    const handletAnnulla = () => {
        navigate(`/edit-scheda?scheda=${idScheda}`);
    }


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
                            label="Autore"
                            name="autore"
                            rules={rules("autore")}
                        >
                            <ReactQuill value={autoreValue} onChange={setAutoreValue} />
                        </Form.Item>
                        <Form.Item
                            label="Titolo"
                            name="titolo"
                            rules={rules("titolo")}
                        >
                            <ReactQuill value={titoloValue} onChange={setTitoloValue} />
                        </Form.Item>
                        <Form.Item
                            label="Testo"
                            name="testo"
                            rules={rules("testo")}
                        >
                            <ReactQuill value={textValue} onChange={setTextValue} />
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
                        <Form.Item>
                            <Button type="primary" block onClick={handletAnnulla}>
                                Annulla
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default FormComponent;
