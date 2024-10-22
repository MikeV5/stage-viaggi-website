import React from "react";
import { Button, Form, Grid, Input, Card, theme, Typography, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Importiamo la funzione di Firebase
import { auth } from './firebase'; // Importa l'auth configurato

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function SignUpPage() {
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = async (values) => {
    const { email, password } = values;
    
    try {
      // Utilizza Firebase per creare un nuovo utente
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);
      
      // Mostra un messaggio di successo
      message.success("Registrazione avvenuta con successo!");
    } catch (error) {
      console.error("Errore nella registrazione:", error);
      // Mostra un messaggio di errore
      message.error("Registrazione fallita. Controlla i dati inseriti.");
    }
  };

  const styles = {
    section: {
      display: "flex",
      justifyContent: "center", // Centra il form orizzontalmente
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    card: {
      width: "100%",
      maxWidth: "380px",
      padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "center",
    },
    signup: {
      marginTop: token.marginLG,
      textAlign: "center",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.125" width="32" height="32" rx="6.4" fill="#1890FF" />
            <path d="M19.3251 4.80005H27.3251V12.8H19.3251V4.80005Z" fill="white" />
            <path d="M12.925 12.8H19.3251V19.2H12.925V12.8Z" fill="white" />
            <path d="M4.92505 17.6H14.525V27.2001H4.92505V17.6Z" fill="white" />
          </svg>

          <Title style={styles.title}>Registrazione</Title>
        </div>

        <Form
          name="normal_signup"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Inserisci il tuo nome!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ type: "email", required: true, message: "Inserisci la tua email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            extra="Password minimo di 8 caratteri."
            rules={[{ required: true, message: "Inserisci la tua password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px"}}>
            <Button block type="primary" htmlType="submit">
              Registrati
            </Button>
            <div style={styles.signup}>
              <Text style={styles.text}>Sei già registrato?</Text>{" "}
              <Link href="/login">Log in</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
}
