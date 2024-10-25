import { useEffect, useState } from 'react';            //Informazioni scheda
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Divider, Tag, Modal } from "antd"; // Importa Modal da Ant Design
import { db, auth } from './firebase';
import { ref, get, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
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
            <Text style={{ ...styles.title }}>{stripHtmlTags(scheda.titolo)}</Text>
            <Text style={styles.text}>{stripHtmlTags(scheda.testo)}</Text>
        </Page>
    </Document>
);

// Funzione per la conferma
const showConfirm = (handleEliminaClick) => {
    Modal.confirm({
        title: 'Sei sicuro di voler eliminare questa scheda?',
        content: 'Questa azione è irreversibile.',
        okText: 'Sì',
        cancelText: 'No',
        okButtonProps: { style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' } }, // Rosso per "Sì"
        cancelButtonProps: { style: { color: 'black' } }, // Nero per "No"
        onOk: handleEliminaClick,
    });
};

const EditScheda = () => {
    const [scheda, setScheda] = useState();
    const [searchParams] = useSearchParams();
    const idScheda = searchParams.get("scheda");
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
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

    const handleEliminaClick = () => {
        const schedaRef = ref(db, `schede/${idScheda}`);
        remove(schedaRef)
            .then(() => {
                alert("Scheda eliminata con successo.");
                navigate('/');
            })
            .catch((error) => {
                console.error('Errore nella cancellazione della scheda:', error);
                alert("Errore nella cancellazione della scheda.");
            });
    };

    // Funzione per formattare la data
    const formatData = (isoDate) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoDate).toLocaleDateString('it-IT', options);
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
                                <span style={{ marginLeft: '16px', color: 'red' }}>Nessun tag trovato</span>
                            )}
                        </div>
                        {/* Aggiungi la data di creazione qui */}
                        <div style={{ textAlign: 'right', marginTop: 16, fontSize: '12px', color: '#888' }}>
                            {scheda.data ? `Creato: ${formatData(scheda.data)}` : ''}
                        </div>
                        {/* Aggiungi la data di creazione qui */}
                        <div style={{ textAlign: 'right', marginTop: 16, fontSize: '12px', color: '#888' }}>
                            {scheda.dataLastModifica ? `Ultima modifica: ${formatData(scheda.dataLastModifica)}` : ''}
                        </div>
                    </div>
                </Card>
                {isLoggedIn && (
                    <Button style={{ marginTop: 16, marginRight: 16 }} onClick={handleEditClick}>
                        Modifica
                    </Button>
                )}
                {isLoggedIn && (
                    <Button style={{ marginTop: 16 }} onClick={() => showConfirm(handleEliminaClick)}>
                        Elimina
                    </Button>
                )}
            </Col>
        </Row>
    );
};

export default EditScheda;
