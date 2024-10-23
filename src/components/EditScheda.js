import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Divider, Tag } from "antd";
import { db, auth } from './firebase'; // Importa auth da firebase
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth'; // Importa onAuthStateChanged
import { PDFDownloadLink, Document, Page, Text, StyleSheet, Font } from '@react-pdf/renderer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/Form.css';
import 'react-quill/dist/quill.bubble.css';

Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: '/fonts/Roboto-Regular.ttf',
      },
      {
        src: '/fonts/Roboto-Italic.ttf',
        fontStyle: 'italic',
      },
      {
        src: '/fonts/Roboto-Bold.ttf',
        fontWeight: 'bold'
      },
      {
        src: '/fonts/Roboto-BoldItalic.ttf',
        fontStyle: 'italic',
        fontWeight: 'bold'
      },
    ],
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        margin: 20,
        padding: '20px 60px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    autore: {
        fontFamily: 'Roboto',
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    title: {
        fontFamily: 'Roboto',
        textAlign: 'justify',
        fontSize: 14,
        fontStyle: 'italic', 
        fontWeight: 'bold',
        marginVertical: 10,
    },
    text: {
        fontFamily: 'Roboto',
        textAlign: 'justify',
        fontSize: 12,
        marginVertical: 10,
    },
});

const stripHtmlTags = (html) => {
    if (!html || !/<[a-z][\s\S]*>/i.test(html)) {
        return html || ''; // Se non ci sono tag HTML, restituisci la stringa così com'è o una stringa vuota se html è null
    }
    
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    let text = '';
    paragraphs.forEach((p, index) => {
        const innerText = p.textContent.trim();
        if (innerText === '<br>') {
            text += '\n'; // Aggiungi un salto di linea se trovi '<p><br></p>'
        } else {
            text += innerText;
            if (index < paragraphs.length - 1) {
                text += '\n'; // Aggiungi un salto di linea tra i paragrafi
            }
        }
    });
    return text;
};

const MyDocument = ({ scheda }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.autore}>{stripHtmlTags(scheda.autore)}</Text>
            <Text style={{ ...styles.title}}>{stripHtmlTags(scheda.titolo)}</Text>
            <Text style={styles.text}>{stripHtmlTags(scheda.testo)}</Text>
        </Page>
    </Document>
);

const EditScheda = () => {
    const [scheda, setScheda] = useState();
    const [searchParams] = useSearchParams();
    const idScheda = searchParams.get("scheda");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per l'autenticazione

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Imposta lo stato in base alla presenza dell'utente
        });
        return () => unsubscribe(); // Pulisci l'evento all'unmount
    }, []);

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
        return null;
    }

    const handleEditClick = () => {
        navigate(`/edit-form?scheda=${idScheda}`);
    };

    return (
        <Row justify="center">
            <Col xs={24} md={12}>
                <Card>
                    <div>
                        <h1>
                            <ReactQuill
                                value={scheda.autore}
                                readOnly={true}
                                theme={"bubble"}
                                className="autoreEdit-quill"
                            />
                        </h1>
                        <Divider />
                        <h3>
                            <ReactQuill
                                value={scheda.titolo}
                                readOnly={true}
                                theme={"bubble"}
                                className="titoloEdit-quill"
                            />
                        </h3>
                        <Divider />
                        <ReactQuill
                            value={scheda.testo}
                            readOnly={true}
                            theme={"bubble"}
                        />
                        <div style={{ textAlign: 'left', marginTop: 16, marginLeft: '16px' }}>
                            <PDFDownloadLink document={<MyDocument scheda={scheda} />} fileName="scheda.pdf">
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Generazione PDF...' : 'Scarica PDF'
                                }
                            </PDFDownloadLink>
                        </div>
                        <Divider />
                        <div>
                            {scheda.tags && scheda.tags.length > 0 ? (
                                scheda.tags.map((tag, index) => (
                                    <Tag key={index} color="gold" style={{ margin: '4px', marginLeft: '16px' }}>
                                        {tag}
                                    </Tag>
                                ))
                            ) : (
                                <span style={{marginLeft: '16px',  color: 'red' }}>Nessun tag trovato</span>
                            )}
                        </div>
                    </div>
                </Card>
                {isLoggedIn && ( // Mostra il pulsante solo se l'utente è loggato
                    <Button style={{ marginTop: 16 }} onClick={handleEditClick}>
                        Modifica
                    </Button>
                )}
            </Col>
        </Row>
    );
};

export default EditScheda;
