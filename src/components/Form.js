import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, set, push, get, child } from 'firebase/database';

import { Row, Col, Card, Form, Input, Button, Space, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import '../styles/Form.css';

const FormComponent = () => {

    const [form] = Form.useForm();

    const [schede, setSchede] = useState([]);

    const handleSubmit = (values) => {
        // Converti i tag in minuscolo
        if (values.tags) {
            values.tags = values.tags.map(tag => tag.toLowerCase());
        }
        console.log(values)
        // return;

        const nuovaSchedaRef = push(ref(db, 'schede'));
        set(nuovaSchedaRef, values)
            .then(() => {
                alert('Dati salvati nel database!');
                form.resetFields(); // Reset del form dopo il salvataggio della scheda
            })
            .catch((error) => {
                console.error('Errore nel salvataggio dei dati:', error);
            });
    };


    return (
        <Row justify="center">
            <Col xs={24} md={12}>
                <Card
                    title="Inserire Informazioni"
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >

                        <Form.Item
                            label="Autore"
                            name="autore"
                            rules={[
                                {
                                    required: true,
                                    message: 'Inserire autore!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Titolo"
                            name="titolo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Inserire titolo!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Testo"
                            name="testo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Inserire testo!',
                                },
                            ]}
                        >
                            <Input.TextArea rows={10} />
                        </Form.Item>
                        <Divider />
                        <Form.List name="tags">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                marginRight: 8,
                                                // display: 'flex',
                                                // marginBottom: 8,
                                            }}
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
                            <Button type="primary" block onClick={(e) => {
                                form.submit(e);
                            }}>
                                Salva
                            </Button>
                        </Form.Item>
                    </Form>

                </Card>
            </Col>
        </Row>
    )
};

export default FormComponent;
