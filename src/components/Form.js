import React, { useState } from 'react';        //AggiungiScheda
import { db } from './firebase';
import { ref, set, push } from 'firebase/database';
import { Row, Col, Card, Form, Input, Button, Space, Divider } from 'antd';
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
    const [textValue, setTextValue] = useState('');
    const [autoreValue, setAutoreValue] = useState('');
    const [titoloValue, setTitoloValue] = useState('');
    const [touchedFields, setTouchedFields] = useState({});

    const handleFieldBlur = (fieldName) => {
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    const handleSubmit = (values) => {

        if (!stripHtmlTags(autoreValue) || !stripHtmlTags(titoloValue) || !stripHtmlTags(textValue)) {
            alert('Assicurati di compilare tutti i campi.');
            return;
        }

        values.testo = textValue;
        values.autore = autoreValue;
        values.titolo = titoloValue;

        if (values.tags) {
            values.tags = values.tags.map(tag => tag.toLowerCase());
        }

        // Aggiungi la data di creazione
        values.data = new Date().toISOString();

        const nuovaSchedaRef = push(ref(db, 'schede'));
        set(nuovaSchedaRef, values)
            .then(() => {
                alert('Dati salvati nel database!');
                form.resetFields();
                setTextValue('');
                setAutoreValue('');
                setTitoloValue('');
                setTouchedFields({});
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
                            rules={rules("Autore")}
                        >
                            <ReactQuill value={autoreValue} onChange={setAutoreValue} />
                        </Form.Item>
                        <Form.Item
                            label="Titolo"
                            name="titolo"
                            rules={rules("Titolo")}
                        >
                            <ReactQuill value={titoloValue} onChange={setTitoloValue} />
                        </Form.Item>
                        <Form.Item
                            label="Testo"
                            name="testo"
                            rules={rules("Testo")}
                        >
                            <ReactQuill value={textValue} onChange={setTextValue} />
                        </Form.Item>
                        <Divider />
                        <Form.List name="tags">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{ marginRight: 8 }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Inserisci il tag!',
                                                    },
                                                ]}
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
