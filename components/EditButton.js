'use client';
import React, { useState } from 'react';
import { Button, Modal, Form, message, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useFormState } from '../hooks/useFormState';
// import { useFormState } from 'react-dom';

import { editUser } from '../util/actions/userAction';

const EditButton = ({ id, record }) => {  // 确保通过props传递record
  const [formAction, formState] = useFormState(editUser, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.setFieldsValue({
      email: record.email,
      passwordHash: record.passwordHash
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    message.success("修改成功");
    setIsModalOpen(false); // 关闭模态框
  };

  const handleCancel = () => {
    setIsModalOpen(false); // 关闭模态框
  };

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('passwordHash', values.passwordHash);
      
      if (typeof formAction === 'function') {
        const result = await formAction(id, formData);  // 提交表单数据
        if (result && result.success) {
          handleOk();
        } else {
          message.error(result.message || "修改失败");
        }
      } else {
        throw new Error("formAction is not a function");
      }
    } catch (error) {
      message.error("修改失败");
      console.error(error);
    }
  };

  return (
    <>
      <Button icon={<EditOutlined />} type="primary" onClick={showModal}>
        修改
      </Button>
      <Modal
        title="修改用户"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
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
            name="passwordHash"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
