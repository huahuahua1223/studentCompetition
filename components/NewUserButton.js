'use client';
import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EditButton from './EditButton';
import { useFormState, useFormStatus } from 'react-dom';

import { addUser } from '../util/actions/userAction';

const NewUserButton = () => {
  const [formMessage, formAction] = useFormState(addUser, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);

      await formAction(formData);
      message.success('增加成功');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('增加失败');
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} type="primary" onClick={showModal}>
        新增用户
      </Button>
      <Modal
        title="新增用户"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '请输入邮箱!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NewUserButton;
