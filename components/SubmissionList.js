// components/RegistrationList.js
'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, message } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';

function AdminSubmissionsPage() {
  const { id } = useParams(); // 竞赛id
  const role = Cookies.get('Role'); // 角色
  const userId = Cookies.get('Id'); // 用户id
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取上传文件列表
    async function fetchSubmissions() {
      try {
        let response;
        if (role === 'admin') {
          response = await axios.get(`http://localhost:2531/submissions/`);
        } else {
          response = await axios.get(`http://localhost:2531/submissions/users/${userId}`);
        }
        const data = response.data;

        // 平展化数据
        const flattenedData = data.flatMap(submission => 
          submission.files.map(file => ({
            id: file.id,
            username: submission.username, 
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            uploadTime: submission.uploadTime,
            submissionId: submission.id,
            competitionTitle: submission.competitionTitle
          }))
        );
        console.log(flattenedData)

        setSubmissions(flattenedData);
      } catch (error) {
        console.error('获取上传文件列表失败:', error);
        message.error('获取上传文件列表失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [id, role]);

  const handleDownload = (fileUrl) => {
    window.open(`http://localhost:2531/submissions/download${fileUrl}`, '_blank');
  };

  const handleDelete = async (submissionId) => {
    try {
      await axios.delete(`http://localhost:2531/submissions/${submissionId}`);
      message.success('删除成功');
      setSubmissions(submissions.filter((submission) => submission.id !== submissionId));
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请稍后再试');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
        title: '竞赛名',
        dataIndex: 'competitionTitle',
        key: 'competitionTitle',
      },
    {
      title: '文件作品名',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.fileUrl)}
            style={{ marginRight: 8 }}
          >
            下载
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.submissionId)}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  return (
    <div style={{ margin: '20px' }}>
      <Table
        dataSource={submissions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default AdminSubmissionsPage;
