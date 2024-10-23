import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Input, Alert, Space, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { db, auth } from './firebase'; // Assicurati di importare auth da firebase
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'; // Importa onAuthStateChanged
import logo from '../styles/logo_sito.jpg';  // Importa il logo
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/App.css';

const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// Funzione debounce
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const Content = () => {
    const [cercato, setCercato] = useState(false);
    const [schede, setSchede] = useState([]);
    const [tags, setTags] = useState(['']);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per l'autenticazione

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

    // Controlla lo stato di autenticazione dell'utente
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Imposta lo stato in base alla presenza dell'utente
        });
        return () => unsubscribe(); // Pulisci l'evento all'unmount
    }, []);

    const handleAuthCheck = () => {
        if (isLoggedIn) {
            alert("Sei loggato!");
        } else {
            alert("Non sei loggato!");
        }
    };

    // Funzione di ricerca
    const fetchSchede = useCallback(() => {
        const chiaviCercate = tags.map(tag => tag.toLowerCase()).filter(tag => tag);

        const schedeRef = ref(db, 'schede');
        get(schedeRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let data = [];
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

                    // Ordina le schede per autore in ordine alfabetico
                    data = data.sort((a, b) => {
                        const autoreA = stripHtmlTags(a.autore).toLowerCase();
                        const autoreB = stripHtmlTags(b.autore).toLowerCase();
                        if (autoreA < autoreB) return -1;
                        if (autoreA > autoreB) return 1;
                        return 0;
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
    }, [tags]);

    //Funzione debounce per la ricerca dinamica
    const debouncedFetchSchede = useCallback(debounce(fetchSchede, 500), [fetchSchede]);
    //Esegue la ricerca ogni volta che i tag cambiano
    useEffect(() => {
        debouncedFetchSchede();
    }, [tags, debouncedFetchSchede]);

    return (
        <>
        <Row justify="center">
            <Col xs={24} md={12}>
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" style={{ marginBottom: '16px' }} onClick={handleAuthCheck}>
                        Controlla Stato
                    </Button>
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
                    <Button type="primary" block onClick={fetchSchede} style={{ marginLeft: '8px' }}>
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
                            Risultati ricerca: {schede.length}
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
                    height: auto.
                }
            }
        `}</style>
        </>
    );
};

export default Content;
