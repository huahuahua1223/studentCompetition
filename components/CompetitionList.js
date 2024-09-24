'use client';
import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Button, Modal, Input, Form, Popconfirm, message, DatePicker } from 'antd';
import Link from 'next/link'; // 引入Next.js的Link组件用于导航
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import Cookies from 'js-cookie';

const { Title } = Typography;

const CompetitionList = () => {
  const [competitions, setCompetitions] = useState([]); // 竞赛信息
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState(null);
  // 筛选和搜索状态
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');

  const [form] = Form.useForm();
  const router = useRouter();
  const role = Cookies.get('Role');


  // 获取竞赛信息
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('http://localhost:2531/competitions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCompetitions(data);
      } catch (error) {
        console.error('Failed to fetch competitions:', error);
      }
    };

    fetchCompetitions();
  }, []);

  // 详情
  const handleCompetitionClick = (competition) => {
    router.push(`/competitions/${competition.id}`);
  };

  // 修改按钮点击
  const handleEditClick = (competition) => {
    setCurrentCompetition(competition);
    form.setFieldsValue({
      ...competition,
      startTime: moment(competition.startTime),
      endTime: moment(competition.endTime),
      registrationDeadline: moment(competition.registrationDeadline),
    });
    setIsEditModalVisible(true);
  };

  // 删除
  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:2531/competitions/${id}`, {
        method: 'Delete',
      });
      if (!response.ok) {
        message.error("删除失败")
        throw new Error('Failed to delete competition');
      }
      setCompetitions((prevCompetitions) => prevCompetitions.filter(competition => competition.id !== id));
      message.success("删除成功")
    } catch (error) {
      console.error('Failed to delete competition:', error);
      message.error("删除失败")
    }
  };

  // 修改
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
        registrationDeadline: values.registrationDeadline.format('YYYY-MM-DD HH:mm:ss'),
      };
      // 发送 PUT 请求修改竞赛信息
      await fetch(`http://localhost:2531/competitions/${currentCompetition.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });
      setCompetitions((prevCompetitions) =>
        prevCompetitions.map((comp) => (comp.id === currentCompetition.id ? { ...comp, ...values } : comp))
      );
      message.success("修改成功");
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Failed to edit competition:', error);
      message.error("修改失败");
    }
  };

  // 添加
  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
        registrationDeadline: values.registrationDeadline.format('YYYY-MM-DD HH:mm:ss'),
      };
      const response = await fetch('http://localhost:2531/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });
      if (!response.ok) {
        throw new Error('Failed to add competition');
      }
      const newCompetition = await response.json();
      setCompetitions((prevCompetitions) => [...prevCompetitions, newCompetition]);
      message.success("添加成功");
      setIsAddModalVisible(false);
      form.resetFields();
      window.location.href = "/competitions";
    } catch (error) {
      console.error('Failed to add competition:', error);
      message.error("添加失败");
    }
  };

  // 取消
  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
  };

  const handleStartDateChange = (date, dateString) => {
    if (dateString && moment(dateString, 'YYYY-MM-DD', true).isValid()) {
      setStartDate(moment(dateString, 'YYYY-MM-DD').toDate());
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date, dateString) => {
    if (dateString && moment(dateString, 'YYYY-MM-DD', true).isValid()) {
      setEndDate(moment(dateString, 'YYYY-MM-DD').toDate());
    } else {
      setEndDate(null);
    }
  };

  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const filteredCompetitions = competitions.filter((competition) => {
    const titleMatches = competition.title.toLowerCase().includes(searchText.toLowerCase());
    const locationMatches = competition.location.toLowerCase().includes(searchLocation.toLowerCase());
    let startDateMatches = true;
    let endDateMatches = true;

    if (startDate && competition.startTime) {
      startDateMatches = moment.utc(competition.startTime).isSameOrAfter(moment.utc(startDate), 'day');
    }
    if (endDate && competition.endTime) {
      endDateMatches = moment.utc(competition.endTime).isSameOrBefore(moment.utc(endDate), 'day');
    }

    return titleMatches && locationMatches && startDateMatches && endDateMatches;
  });



  return (
    <div>
      <Title level={2}>竞赛列表</Title>
      {role === 'admin' && (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>
          添加竞赛
        </Button>
      )}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8}>
          <Input.Search
            placeholder="请输入竞赛标题"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <DatePicker
            placeholder="开始日期"
            format="YYYY-MM-DD"
            value={startDate ? moment(startDate, 'YYYY-MM-DD') : null}
            onChange={handleStartDateChange}
            style={{ marginBottom: 16, width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <DatePicker
            placeholder="结束日期"
            format="YYYY-MM-DD"
            value={endDate ? moment(endDate, 'YYYY-MM-DD') : null}
            onChange={handleEndDateChange}
            style={{ marginBottom: 16, width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Input.Search
            placeholder="请输入竞赛地点"
            allowClear
            onChange={handleLocationChange}
            style={{ marginBottom: 16 }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        {filteredCompetitions.map((competition) => (
          <Col xs={24} sm={12} lg={8} key={competition.id}>
            <Card
              hoverable
              style={{ width: '100%', margin: '8px 0' }}
              title={competition.title}
              extra={new Date(competition.startTime).toLocaleDateString()}
              onClick={() => handleCompetitionClick(competition)}
              actions={
                role === 'admin' ? [
                  <Button type="primary" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEditClick(competition); }}>
                    修改
                  </Button>,
                  <Popconfirm
                    title="确定删除这个竞赛吗？"
                    onConfirm={(e) => { e.stopPropagation(); handleDeleteClick(competition.id); }}
                    okText="是"
                    cancelText="否"
                    onCancel={(e) => e.stopPropagation()} // 阻止点击事件冒泡到父级元素
                  >
                    <Button type="primary" icon={<DeleteOutlined />} danger onClick={(e) => e.stopPropagation()}>
                     删除
                    </Button>
                  </Popconfirm>
                ] : []
              }
            >
              <p><b>描述:</b> {competition.description}</p>
              <p><b>位置:</b> {competition.location}</p>
              <p><b>结束时间:</b> {new Date(competition.endTime).toLocaleDateString()}</p>
              <p><b>报名截止:</b> {new Date(competition.registrationDeadline).toLocaleDateString()}</p>
              <p><b>最大参与人数:</b> {competition.maxParticipants}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 修改 */}
      <Modal
        title="修改竞赛"
        visible={isEditModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical" form={form} initialValues={currentCompetition}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="位置">
            <Input />
          </Form.Item>
          <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请输入开始时间' }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请输入结束时间' }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="registrationDeadline" label="报名截止" rules={[{ required: true, message: '请输入报名截止时间' }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="maxParticipants" label="最大参与人数">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 增加 */}
      <Modal
        title="添加竞赛"
        visible={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="位置">
            <Input />
          </Form.Item>
          <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请输入开始时间' }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请输入结束时间' }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="registrationDeadline" label="报名截止" rules={[{ required: true, message: '请输入报名截止时间' }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="maxParticipants" label="最大参与人数">
            <Input />
          </Form.Item>
          <Form.Item name="createdBy" label="创建人">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompetitionList;