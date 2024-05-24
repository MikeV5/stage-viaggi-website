import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Input, Alert, Space, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { db } from './firebase';
import { ref, get } from 'firebase/database';
import logo from '../styles/logo_sito.jpg';  // Importa il logo
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/App.css';

const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const Content = () => {
    const [cercato, setCercato] = useState(false);
    const [schede, setSchede] = useState([]);
    const [tags, setTags] = useState(['']);
  
    const handleAddTag = () => {
        setTags([...tags, '']);
    };
  
    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };
  
    const handleTagChange = (index, event) => {
        const newTags = [...tags];
        newTags[index] = event.target.value;
        setTags(newTags);
    };
  
    const handleSubmit = () => {
        const chiaviCercate = tags.map(tag => tag.toLowerCase()).filter(tag => tag);

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
                            return tags.some((tag) => tag.toLowerCase().includes(chiaveCercata));
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
    };

    return (
        <>
        <Row justify="center">
            <Col xs={24} md={12}>
                <div style={{ textAlign: 'center' }}>
                    <img src={logo} alt="Logo del sito" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <Card>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {tags.map((tag, index) => (
                                <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Input
                                        placeholder="Tag"
                                        value={tag}
                                        onChange={(e) => handleTagChange(index, e)}
                                        style={{ width: '200px' }}
                                    />
                                    <MinusCircleOutlined onClick={() => handleRemoveTag(index)} />
                                </Space>
                            ))}
                        </div>
                        <Button type="dashed" onClick={handleAddTag} block icon={<PlusOutlined />}>
                            Aggiungi Tag
                        </Button>
                    </div>
                    <Button type="primary" block onClick={handleSubmit} style={{ marginLeft: '8px' }}>
                        Cerca
                    </Button>
                </Card>
            </Col>
        </Row>
        {cercato &&
        <Row justify="center" style={{ marginTop: 16 }}>
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
                                <div key={index} style={{ marginBottom: '2px' }}> {/* Contenitore esterno con margine inferiore */}
                                <Link to={`/edit-scheda?scheda=${id}`}>
                                <Card hoverable>
                                <div style={{ padding: '0px 0px 0px 0px' }}> {/* Aggiunto padding orizzontale */}
                                            <h1 className="autore-quill">
                                                <ReactQuill
                                                    value={scheda.autore}
                                                    readOnly={true}
                                                    theme={"bubble"}
                                                />
                                            </h1>
                                            <Divider />
                                            <div className="titolo-quill">
                                                <ReactQuill
                                                    value={scheda.titolo}
                                                    readOnly={true}
                                                    theme={"bubble"}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
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
    );
};

export default Content;
