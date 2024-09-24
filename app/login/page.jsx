// LoginForm.js
"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { Form, Input, Button, Alert, Row, Col  } from "antd";
import loginAction from "./loginAction";  // 引入服务器端函数
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError(null);

//     try {
//       const json = await loginAction(new FormData(event.target));
//       Cookies.set('Authorization', json.token, { expires: json.expires, path: '/' });
//       window.location.href = "/users";
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Email</label>
//         <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//       </div>
//       <div>
//         <label>Password</label>
//         <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//       </div>
//       <button type="submit">Login</button>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//     </form>
//   );
// }

export default function LoginForm() {
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setError(null);
    console.log("values:",values)

    try {
      const json = await loginAction(values);
      console.log("过期时间",json.expires)

      // 将必要的信息存储到 cookies 中
      Cookies.set('Authorization', json.token, { expires: new Date(json.expires * 1000), path: '/' });
      Cookies.set('Id', json.id, { expires: json.expires, path: '/' });
      Cookies.set('Role', json.role, { expires: json.expires, path: '/' });

      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    // <Form
    //   name="login"
    //   onFinish={handleSubmit}
    //   initialValues={{ remember: true }}
    //   style={{ maxWidth: 300, margin: '0 auto' }}
    // >
    //   <Form.Item
    //     label="用户名"
    //     name="username"
    //     rules={[{ required: true, message: 'Please input your username!' }]}
    //   >
    //     <Input />
    //   </Form.Item>
    //   <Form.Item
    //     label="密码"
    //     name="password"
    //     rules={[{ required: true, message: 'Please input your password!' }]}
    //   >
    //     <Input.Password />
    //   </Form.Item>
    //   <Form.Item>
    //     <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
    //       Login
    //     </Button>
    //   </Form.Item>
    //   {error && <Alert message={error} type="error" showIcon />}
    // </Form>
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <div style={{ padding: 24, background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: 8 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>登录</h2>
          <Form
            name="login"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                登录
              </Button>
            </Form.Item>
            {error && <Alert message={error} type="error" showIcon />}
          </Form>
        </div>
      </Col>
    </Row>
  );
}

