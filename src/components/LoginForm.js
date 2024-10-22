import React from "react";
import { Button, Checkbox, Form, Grid, Input, Card, theme, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function App() {
  const { token } = useToken();
  const screens = useBreakpoint();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const styles = {
    section: {
      display: "flex",
      justifyContent: "center", // Centra il form orizzontalmente
     // paddingTop: "50px", // Aggiungi spazio dall'alto
     alignItems: "center",
      backgroundColor: token.colorBgContainer,
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
      //height: "100vh", // Imposta l'altezza a 100vh per garantire il corretto allineamento
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
              <Link href="">Registrati</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
}
