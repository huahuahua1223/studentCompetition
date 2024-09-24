'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Modal, Progress, Row, Col } from 'antd';
import { IdcardOutlined , UserOutlined, MailOutlined, LockOutlined, InfoCircleOutlined, UploadOutlined, ProfileOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const UploadUser = () => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0); // 添加密码强度状态

  const router = useRouter(); // 初始化 useRouter

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      // 只添加存在的字段到formData中
      Object.keys(values).forEach((key) => {
        if (key !== 'avatar' && values[key]) {
          formData.append(key, values[key]);
        }
      });

      // 处理文件上传
      if (values.avatar && values.avatar.fileList && values.avatar.fileList.length > 0) {
        const file = values.avatar.fileList[0].originFileObj;
        formData.append('avatar', file);
      }

      // 使用Axios发送请求
      const response = await axios.post('http://localhost:2531/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('用户添加成功');
      router.push('/login');
      // 处理响应...
    } catch (error) {
      message.error('用户添加失败');
      console.error('Error:', error);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>点击上传头像</div>
    </div>
  );

  // 计算密码强度
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // 改变密码时计算强度
  const onPasswordChange = (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
    form.setFieldsValue({ password });
  };

  // 验证规则
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject('密码是必填项!');
    }
    if (value.length < 8) {
      return Promise.reject('密码必须至少8个字符长!');
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject('密码必须包含至少一个大写字母!');
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject('密码必须包含至少一个小写字母!');
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject('密码必须包含至少一个数字!');
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return Promise.reject('密码必须包含至少一个特殊字符!');
    }
    return Promise.resolve();
  };

  // 强度颜色
  const getPasswordProgressColor = () => {
    switch (passwordStrength) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'blue';
      case 5:
        return 'green';
      default:
        return 'red';
    }
  };

  // 强度文字
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return '密码强度：弱';
      case 1:
        return '密码强度：较弱';
      case 2:
        return '密码强度：一般';
      case 3:
        return '密码强度：较强';
      case 4:
        return '密码强度：强';
      case 5:
        return '密码强度：非常强';
      default:
        return '密码强度：未知';
    }
  };

  return (
    // <Form form={form} layout="vertical" onFinish={handleFinish}>
    //   <Form.Item
    //     name="username"
    //     label="用户名"
    //     rules={[{ required: true, message: '用户名是必填项!' }]}
    //   >
    //     <Input placeholder="请输入用户名" />
    //   </Form.Item>

    //   <Form.Item
    //     name="email"
    //     label="电子邮件"
    //     rules={[
    //       { required: true, message: '电子邮件是必填项!' },
    //       { type: 'email', message: '请输入有效的电子邮件地址!' },
    //     ]}
    //   >
    //     <Input placeholder="请输入电子邮件" />
    //   </Form.Item>

    //   <Form.Item
    //     name="password"
    //     label="密码"
    //     rules={[
    //       // { required: true, message: '密码是必填项!' },
    //       { validator: validatePassword }
    //     ]}
    //   >
    //     <Input.Password placeholder="请输入密码" onChange={onPasswordChange} />
    //   </Form.Item>

    //   <div style={{ marginBottom: 16 }}>{getPasswordStrengthText()}</div>

    //   <Progress
    //     percent={(passwordStrength / 5) * 100}
    //     showInfo={false}
    //     strokeColor={getPasswordProgressColor()}
    //   />

    //   <Form.Item
    //     name="role"
    //     label="角色"
    //     initialValue="user" // 设置默认值为 "user"
    //   >
    //     <Input placeholder="用户" disabled />
    //   </Form.Item>

    //   <Form.Item
    //     name="name"
    //     label="姓名"
    //     // rules={[{ required: true, message: '姓名是必填项!' }]}
    //   >
    //     <Input placeholder="请输入姓名" />
    //   </Form.Item>

    //   <Form.Item
    //     name="bio"
    //     label="个人简介"
    //   >
    //     <Input.TextArea placeholder="请输入个人简介" />
    //   </Form.Item>

    //   <Form.Item name="avatar" label="头像">
    //     {/* <Upload
    //       name="avatar"
    //       listType="picture-card"
    //       className="avatar-uploader"
    //       showUploadList={false}
    //       beforeUpload={false} // 不触发自动上传
    //       customRequest={async ({ file, onProgress, onSuccess, onError }) => {
    //         try {
    //           const formData = new FormData();
    //           formData.append('avatar', file);
    //           console.log(file)

    //           const response = await axios.post('http://localhost:2531/users/register', formData, {
    //             headers: {
    //               'Content-Type': 'multipart/form-data',
    //             },
    //             onUploadProgress: progressEvent => {
    //               onProgress(progressEvent);
    //             },
    //           });

    //           onSuccess(response, file);
    //         } catch (error) {
    //           console.log(error)
    //           onError(error);
    //         }
    //       }}
    //       onChange={normFile}
    //     >
    //       {form.getFieldValue('avatar') ? (
    //         <img src={form.getFieldValue('avatar').url} alt="avatar" style={{ width: '100%' }} />
    //       ) : (
    //         <div>
    //           <i className="upload-icon" />
    //           <div className="ant-upload-text">点击上传头像</div>
    //         </div>
    //       )}
    //     </Upload> */}
    //     <Upload
    //       listType="picture-card"
    //       fileList={fileList}
    //       onPreview={handlePreview}
    //       onChange={handleChange}
    //       beforeUpload={() => false} // 不触发自动上传
    //     >
    //       {fileList.length >= 1 ? null : uploadButton}
    //     </Upload>
    //   </Form.Item>

    //   <Form.Item>
    //     <Button type="primary" htmlType="submit">
    //       提交
    //     </Button>
    //   </Form.Item>

    //   <Modal
    //     open={previewOpen}
    //     footer={null}
    //     onCancel={() => setPreviewOpen(false)}
    //   >
    //     <img alt="example" style={{ width: '100%' }} src={previewImage} />
    //   </Modal>
    // </Form>
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>注册</h2>
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="电子邮件"
              rules={[
                { required: true, message: '请输入电子邮件!' },
                { type: 'email', message: '请输入有效的电子邮件地址!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="请输入电子邮件" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" onChange={onPasswordChange} />
            </Form.Item>
            <div style={{ marginBottom: 16 }}>{getPasswordStrengthText()}</div>
            <Progress
              percent={(passwordStrength / 5) * 100}
              showInfo={false}
              strokeColor={getPasswordProgressColor()}
            />
            <Form.Item
              name="role"
              label="角色"
              initialValue="user"
            >
              <Input prefix={<InfoCircleOutlined />} placeholder="用户" disabled />
            </Form.Item>
            <Form.Item
              name="name"
              label="姓名"
            >
              <Input prefix={<IdcardOutlined />} placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="bio"
              label="个人简介"
            >
              <Input.TextArea
                placeholder="请输入个人简介"
                autoSize={{ minRows: 3, maxRows: 6 }}
                style={{ paddingLeft: '30px' }}
              />
              <ProfileOutlined style={{ position: 'absolute', left: '10px', top: '30px', fontSize: '16px' }} />
            </Form.Item>
            <Form.Item name="avatar" label="头像">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <Modal
        visible={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Row>
  );
};

export default UploadUser;