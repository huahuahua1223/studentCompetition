import React, { useEffect, useState } from 'react';
import { Layout, Button, Avatar, Dropdown, Menu, Typography } from 'antd';
import { ChromeOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';
import styles from './AppHeader.module.css'; // 可选，如果需要自定义样式

const { Header } = Layout;
const { Text } = Typography; // 导入 Typography 中的 Text 组件

function AppHeader() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = Cookies.get('Authorization');
      const id = Cookies.get('Id');

      if (token && id) {
        try {
          const response = await axios.get(`http://localhost:2531/users/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data);
          setIsUserLoggedIn(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsUserLoggedIn(false);
        }
      } else {
        setIsUserLoggedIn(false);
        setUser(null);
      }
    };

    // Check login status initially
    checkLoginStatus();

    // Add event listener for cookie changes
    window.addEventListener('cookieChange', checkLoginStatus);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('cookieChange', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('Authorization');
    Cookies.remove('Id');
    Cookies.remove('Role');
    setIsUserLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/profile">
          个人资料
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" danger onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        <ChromeOutlined spin style={{ fontSize: '3rem', color: '#1890ff', marginRight: '1rem' }} />
        <div style={{ color: '#1890ff' }}>学生竞赛管理平台</div>
      </div>

      {isUserLoggedIn ? (
        <div className={styles.user}>
          <Dropdown overlay={menu} placement="bottomRight">
            <div className={styles.userInfo}>
              <Avatar size={48} src={`http://localhost:2531${user.avatarUrl}`} className={styles.userInfoAvatar} />
              <div>
                <Text style={{ color: '#1890ff' }}>{user.role === 'admin' ? '管理员' : '用户'}</Text>
                {' '}
                <Text style={{ color: '#1890ff' }}>{user.username}</Text>
              </div>
            </div>
          </Dropdown>
        </div>
      ) : (
        <div className={styles.buttons}>
          <Button type="primary" size='small' className={styles.loginButton} href='/login'>
            登录
          </Button>
          <Button type="default" size='small' className={styles.registerButton} href='/register'>
            注册
          </Button>
        </div>
      )}
    </Header>
  );
}

export default AppHeader;
