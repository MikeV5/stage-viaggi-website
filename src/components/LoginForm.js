import React, { useState } from "react";
import { Button, Checkbox, Form, Grid, Input, Card, theme, Typography, message, Alert } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Per reindirizzare dopo il login
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; // Importa l'autenticazione di Firebase

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function LoginForm() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate(); // Usa il navigatore per il redirect
  const [errorMessage, setErrorMessage] = useState(null); // Per gestire gli errori

  const onFinish = (values) => {
    const { email, password } = values;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login riuscito
        console.log("Login effettuato: ", userCredential.user);
        navigate("/"); // Reindirizza all'homepage
      })
      .catch((error) => {
        // Mostra un errore se il login fallisce
        console.error("Errore di login: ", error.message);
        message.error("Errore di login, riprova."); // Alert per il fallimento
      });
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
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
    },
    forgotPassword: {
      float: "right",
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
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z" fill="white" />
            <path d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z" fill="white" />
            <path d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z" fill="white" />
          </svg>

          <Title style={styles.title}>Log in</Title>
        </div>

        {/* Mostra un messaggio di errore se il login fallisce */}
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}

        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Inserisci la tua email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Inserisci la tua password!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ricordami</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="">
              Password dimenticata?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Non sei registrato?</Text>{" "}
              <Link href="/register">Registrati</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
}
