// components/RegistrationList.js
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Pagination, Tag, message, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TagsOutlined, NumberOutlined, UserOutlined, TrophyOutlined, ClockCircleOutlined, MessageOutlined, SettingOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';

const { Title } = Typography;
export default function Registrations() {
  const [registrations, setRegistrations] = useState('' || []);
  const [filteredData, setFilteredData] = useState('' || []);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 每页显示的数据量
  const role = Cookies.get('Role');
  const userId = Cookies.get('Id');

  const columns = [
    {
      title: <span><NumberOutlined /> 报名编号</span>,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: <span><UserOutlined /> 用户名</span>,
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: <span><TrophyOutlined /> 竞赛名</span>,
      dataIndex: 'competitionTitle',
      key: 'competitionTitle',
    },
    {
      title: <span><MessageOutlined /> 状态</span>,
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let displayText;
        switch (text) {
          case 'pending':
            displayText = '待处理';
            break;
          case 'approved':
            displayText = '已批准';
            break;
          case 'rejected':
            displayText = '已拒绝';
            break;
          default:
            displayText = text;
        }
        return <span>{displayText}</span>;
      },
    },
    {
      title: <span><ClockCircleOutlined /> 报名时间</span>,
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      render: (text) => (
        // <span>{text}</span>
        <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: <span><TagsOutlined /> 备注</span>,
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: <span><ClockCircleOutlined /> 处理时间</span>,
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      render: (text) => (
        <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '未处理'}</span>
      ),
    },
    {
      title: <span><SettingOutlined /> 操作</span>,
      key: 'action',
      render: (_, registration) => {
        if (role === 'admin' && registration.status === 'pending') {
          return (
            <div style={{ display: 'flex' }}>
              <Button onClick={() => handleRegistration(registration.id, "approved")}>同意</Button>
              <Button onClick={() => handleRegistration(registration.id, "rejected")}>拒绝</Button>
            </div>
          );
        } else {
          let statusLabel;
          let statusIcon;
          switch (registration.status) {
            case 'approved':
              statusLabel = <Tag color="green" icon={<CheckCircleOutlined />}>已批准</Tag>;
              // statusIcon = <CheckCircleOutlined style={{ color: 'green', marginLeft: 8 }} />;
              break;
            case 'rejected':
              statusLabel = <Tag color="red" icon={<CloseCircleOutlined />}>已拒绝</Tag>;
              // statusIcon = <CloseCircleOutlined style={{ color: 'red', marginLeft: 8 }} />;
              break;
            default:
              statusLabel = <Tag color="yellow" icon={<LoadingOutlined />}>待处理</Tag>;
              // statusIcon = null;
          }
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {statusLabel}
              {statusIcon}
            </div>
          );
        }
      },
    },
  ];

useEffect(() => {
  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:2531/registrations', {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`
        },
      });

      if (role === 'admin') {
        setRegistrations(response.data);
        setFilteredData(response.data);
      } else {
        const userRegistrations = response.data.filter(registration => {
          console.log(`Type of registration.userId: ${typeof registration.userId}`);
          console.log(`Type of userId from Cookies: ${typeof userId}`);
          const match = registration.userId === parseInt(userId, 10);
          console.log(`Comparison for registration ID ${registration.id}: ${match} ${registration.userId} ${parseInt(userId, 10)}`); // 打印每个注册对象的 userId 比较结果
          return match;
        });
        setRegistrations(userRegistrations);
        setFilteredData(userRegistrations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchRegistrations();
}, [role, userId]);

  const handleRegistration = async (registrationId, status) => {
    try {
      await axios.put(`http://localhost:2531/registrations/${registrationId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success("操作成功")

      // 重新获取报名数据
      const response = await axios.get('http://localhost:2531/registrations', {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`
        },
      });
      
      if (role === 'admin') {
        setRegistrations(response.data);
        setFilteredData(response.data);
      } else {
        const userRegistrations = response.data.filter(registration => registration.userId === userId);
        setRegistrations(userRegistrations);
        setFilteredData(userRegistrations);
      }
    } catch (err) {
      console.error(err);
      message.error("操作失败")
    }
  };

  // 处理搜索功能
  const handleSearch = (value) => {
    setSearchText(value);
    if (value === "") {
        setFilteredData(registrations);
    } else {
      const filtered = registrations.filter(
        (item) =>
          item.id.toString().includes(value.toLowerCase()) ||
          (item.username && item.username.toLowerCase().includes(value.toLowerCase())) ||
          (item.competitionTitle && item.competitionTitle.toLowerCase().includes(value.toLowerCase()))
      );
        setFilteredData(filtered);
    }
    setCurrentPage(1); // 重置为第一页
};

// 处理页码改变事件
const handlePageChange = (page) => {
    setCurrentPage(page);
};

// 计算当前页的数据
const currentPageData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
}, [filteredData, currentPage]);

  return (
    <div>
      <Title level={2} style={{ marginBottom: 16 }}>
      {role === 'admin' ? '报名管理' : '个人报名信息'}
    </Title>
      <Input.Search
        placeholder="搜索报名编号、用户名或竞赛名..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={currentPageData}
        pagination={false}
        rowKey="id" // 添加这一行，以确保每行都有唯一的 key
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredData.length}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "center" }}
      />
    </div>
  );
}
