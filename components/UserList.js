// components/UserList.js
"use client";
import React, { useState, useMemo } from "react";
import { Table, Button, Popconfirm, Input, Pagination } from 'antd';
import { UserOutlined, SettingOutlined, MailOutlined, PictureOutlined, NumberOutlined, TeamOutlined } from '@ant-design/icons';
import EditButton from './EditButton';
import DeleteUserButton from './DeleteUserButton';
import NewUserButton from './NewUserButton';

const UserList = ({ users }) => {
    console.log("进入用户列表");
    const [filteredData, setFilteredData] = useState(users || []);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // 每页显示的数据量
    
    const columns = [
        {
            title: <span><NumberOutlined /> 用户编号</span>,
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: <span><UserOutlined /> 用户名</span>,
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: <span><MailOutlined /> 邮箱</span>,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: <span><PictureOutlined /> 图片</span>,
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            render: (text) => (
                <img
                    src={`http://localhost:2531${text}`}
                    alt="avatar"
                    style={{ width: '100px', height: '100px' }}
                />
            ),
        },
        {
            title: <span><TeamOutlined /> 角色</span>,
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: <span><SettingOutlined /> 操作</span>,
            key: 'action',
            render: (_, row) => (
                <div style={{ display: 'flex' }}>
                    <EditButton id={row.id} record={row} />
                    <Popconfirm title="确定删除吗？">
                        <DeleteUserButton id={row.id} onUserDeleted={handleUserDeleted}  />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // 处理删除
    const handleUserDeleted = (id) => {
        const updatedData = filteredData.filter(user => user.id !== id);
        setFilteredData(updatedData);
        setCurrentPage(1);
    };

    // 处理搜索功能
    const handleSearch = (value) => {
        setSearchText(value);
        if (value === "") {
            setFilteredData(users);
        } else {
            const filtered = users.filter(
                (item) =>
                item.username.toLowerCase().includes(value.toLowerCase())
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
            <h1>用户列表</h1>
            <NewUserButton />
            <Input.Search
                placeholder="搜索用户名..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={currentPageData}
                pagination={false}
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

export default UserList;
