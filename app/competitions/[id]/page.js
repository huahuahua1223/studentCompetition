'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Row, Col, Button, Modal, Form, Input, Upload, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, UploadOutlined  } from '@ant-design/icons'; 
import Link from 'next/link';
import Cookies from 'js-cookie';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

function CompetitionPage() {
  const { id } = useParams(); // 竞赛id
  const userId = Cookies.get('Id'); // 用户id
  const role = Cookies.get('Role'); // 角色
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null); // 报名状态
  const [fileList, setFileList] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false); // 控制文件上传部分的显示
  const [registrationId, setregistrationId] = useState(''); // 报名id

  const [form] = Form.useForm();

  useEffect(() => {
    // 获取竞赛信息
    async function fetchCompetition() {
      const response = await fetch(`http://localhost:2531/competitions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCompetition(data);
      } else {
        // 处理错误，例如重定向或显示错误消息
      }
      setLoading(false);
    }

    // 获取报名状态
    async function fetchRegistrationStatus() {
      try {
        const response = await axios.get(`http://localhost:2531/registrations/${userId}/${id}`);
        console.log(response.data[0])
        if (response.data) {
          setRegistrationStatus(response.data[0].status);
          if (response.data[0].status === 'approved') {
            setUploadVisible(true); // 如果报名状态是approved，显示文件上传部分
            setregistrationId(response.data[0].id) // 如果报名状态是approved，设置报名id
          }
        }
      } catch (error) {
        console.error('获取报名状态失败:', error);
      }
    }


    fetchCompetition();
    fetchRegistrationStatus();
  }, [id, userId]);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // 清空备注信息和表单状态
    setNotes('');
    form.resetFields();
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // 报名
  const onFinish = async () => {
    try {
      const response = await axios.post(`http://localhost:2531/registrations`, {
        userId: userId,
        competitionId: id,
        status: 'pending',
        notes: notes,
      });

      message.success('报名成功！');
      handleModalClose(); // 关闭弹窗
      setRegistrationStatus('pending'); // 更新状态为pending
    } catch (error) {
      console.error('报名失败:', error);
      message.error('报名失败，请稍后再试！');
    }
  };

  // 上传多文件
  const handleUpload = async () => {
    const formData = new FormData();
    console.log('registrationId', registrationId)
    formData.append('registrationId', registrationId);
    fileList.forEach((file) => {
      // 使用 encodeURIComponent 对文件名进行编码
      const encodedFileName = encodeURIComponent(file.name);
      console.log('encodedFileName',encodedFileName)
      formData.append('files', file.originFileObj, encodedFileName);
    });

    try {
      const response = await axios.post('http://localhost:2531/submissions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('文件上传成功！');
      setFileList([]); // 清空文件列表
    } catch (error) {
      console.error('文件上传失败:', error);
      message.error('文件上传失败，请稍后再试！');
    }
  };

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (!competition) {
    return <div>竞赛不存在</div>;
  }

  let actionButton;
  switch (registrationStatus) {
    case 'approved':
      actionButton = <Button type="primary" icon={<CheckCircleOutlined />} disabled style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>已通过</Button>;
      break;
    case 'rejected':
      actionButton = <Button type="default" icon={<CloseCircleOutlined />} disabled style={{ backgroundColor: '#f5222d', borderColor: '#f5222d' }}>已拒绝</Button>;
      break;
    case 'pending':
      actionButton = <Button type="primary" disabled style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}>等待批准</Button>;
      break;
    case null:
      actionButton = (
        <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleModalOpen}>
          报名
        </Button>
      );
      break;
    default:
      actionButton = null;
      break;
  }

  return (
    <div style={{ margin: '20px' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title={<Title level={1}>{competition.title}</Title>}
            extra={
              role === 'user' && actionButton
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <Text strong>描述: </Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text>{competition.description}</Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text strong>位置: </Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text>{competition.location}</Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text strong>开始时间: </Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text>{new Date(competition.startTime).toLocaleString()}</Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text strong>结束时间: </Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text>{new Date(competition.endTime).toLocaleString()}</Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text strong>报名截止: </Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text>{new Date(competition.registrationDeadline).toLocaleString()}</Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text strong>最大参与人数: </Text>
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <Text>{competition.maxParticipants}</Text>
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 报名弹窗 */}
      <Modal
        title="报名竞赛"
        visible={showModal}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={onFinish}>
            提交
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="notes"
            label="备注信息"
            rules={[{ required: true, message: '请输入备注信息' }]}
          >
            <Input.TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="请输入备注信息"
            />
          </Form.Item>
        </Form>
      </Modal>

      {uploadVisible && role === 'user' && (
        <div style={{ marginTop: '20px' }}>
          <Card title="上传作品">
            <Form layout="vertical">
              <Form.Item
                name="files"
                label="上传文件"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
              >
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={() => false}
                  multiple
                >
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </Form.Item>
              <Button type="primary" onClick={handleUpload} disabled={fileList.length === 0}>上传</Button>
            </Form>
          </Card>
        </div>
      )}

    </div>
  );
}

export default CompetitionPage;
