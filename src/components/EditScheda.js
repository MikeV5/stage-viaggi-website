import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Divider } from "antd";

import { db } from './firebase';
import { ref, get } from 'firebase/database';
import { PDFDownloadLink, PDFViewer, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

// Definisci gli stili utilizzando StyleSheet
const styles = StyleSheet.create({
    page: {
        margin: 20,
        padding: '20px 60px 20px 20px', // Padding da sinistra a destra: 20px, 40px, 20px, 20px
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Centra verticalmente all'inizio della pagina
        //alignItems: 'center',
    },
    title: {
        //textAlign: 'center',
        //fontSize: 16,
        //fontWeight: 'bold', // Rendi il titolo in grassetto
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    autore: {
      textAlign: 'justify',
      fontSize: 14,
      marginVertical: 10,
  },
    text: {
        textAlign: 'justify',
        fontSize: 12,
        marginVertical: 10,
    },
});

const MyDocument = ({ scheda }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>{scheda.titolo}</Text>
            <Text style={styles.autore}>{scheda.autore}</Text>
            <Text style={styles.text}>{scheda.testo} </Text>
        </Page>
    </Document>
);

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
        return null;
    }

    const handleEditClick = () => {
        navigate(`/edit-form?scheda=${idScheda}`);
    };

    return (
        <Row justify="center">
            <Col xs={24} md={12}>
                <Card>
                    <h2>{scheda.titolo}</h2>
                    <Divider />
                    <p><h3>{scheda.autore}</h3></p>
                    <Divider />
                    <p className="white-space-pre-line">{scheda.testo}</p>
                    <PDFDownloadLink document={<MyDocument scheda={scheda} />} fileName="scheda.pdf">
                        {({ blob, url, loading, error }) =>
                            loading ? 'Generazione PDF...' : 'Scarica PDF'
                        }
                    </PDFDownloadLink>
                </Card>
                <Button style={{ marginTop: 16 }} onClick={handleEditClick}>
                    Modifica
                </Button>
            </Col>
        </Row>
    );
};

export default EditScheda;
