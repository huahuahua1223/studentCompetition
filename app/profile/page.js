// pages/profile.js
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Skeleton, Card, Avatar, Descriptions, Space, Button, Modal, Form, Input, Upload } from 'antd';
import Cookies from 'js-cookie';
import { UploadOutlined } from '@ant-design/icons';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 从 cookies 中获取用户 ID
        const userId = Cookies.get('Id');
        if (!userId) {
          throw new Error('未找到用户 ID');
        }

        const response = await axios.get(`http://localhost:2531/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('Authorization')}`
          }
        });

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        message.error('无法加载用户数据');
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      username: userData.username,
      email: userData.email,
      name: userData.name,
      bio: userData.bio,
      avatar: userData.avatarUrl ? [{
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: `http://localhost:2531${userData.avatarUrl}`
      }] : []
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const userId = Cookies.get('Id');

      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('name', values.name);
      formData.append('bio', values.bio);
      if (values.avatar && values.avatar.length > 0) {
        formData.append('avatar', values.avatar[0].originFileObj);
      }

      // 更新其他资料
      await axios.put(`http://localhost:2531/users/update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('Authorization')}`
        }
      });

      // setUserData({ ...userData, ...values, avatarUrl: values.avatar.file ? URL.createObjectURL(values.avatar.file) : userData.avatarUrl });
      message.success('用户资料更新成功');
      setIsModalOpen(false);
      window.location.href = "/profile";
    } catch (error) {
      message.error('更新用户资料失败');
      console.error('Error updating user data:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList ? e.fileList : [];
  };

  if (loading) {
    return (
      <Skeleton active />
    );
  }

  if (!userData) {
    return <p>找不到用户</p>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <Card
        style={{ width: 500, textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
        actions={[
          <Button type="primary" onClick={handleEditProfile}>
            修改个人资料
          </Button>
        ]}
      >
        <Space direction="vertical" size="large" align="center">
          <Avatar size={100} src={`http://localhost:2531${userData.avatarUrl}`} />
          <h2>{userData.username}</h2>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="电子邮件">{userData.email}</Descriptions.Item>
            <Descriptions.Item label="角色">{userData.role}</Descriptions.Item>
            <Descriptions.Item label="姓名">{userData.name}</Descriptions.Item>
            <Descriptions.Item label="个人简介">{userData.bio}</Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>

      <Modal
        title="修改个人资料"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" initialValues={{
          avatar: userData.avatarUrl ? [{
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: `http://localhost:2531${userData.avatarUrl}`
          }] : []
        }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '用户名是必填项!' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="电子邮件"
            rules={[
              { required: true, message: '电子邮件是必填项!' },
              { type: 'email', message: '请输入有效的电子邮件地址!' },
            ]}
          >
            <Input placeholder="请输入电子邮件" />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '姓名是必填项!' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="个人简介"
          >
            <Input.TextArea placeholder="请输入个人简介" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="头像"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              defaultFileList={userData.avatarUrl ? [{
                uid: '-1',
                name: 'avatar.png',
                status: 'done',
                url: `http://localhost:2531${userData.avatarUrl}`
              }] : []}
            >
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
