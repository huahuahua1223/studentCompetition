// components/Role.js
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function Role() {
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = getCookie('Authorization'); // 从 cookie 中获取认证信息
          const config = {
            headers: {
              Authorization: `Bearer ${token}`, // 设置授权头部信息
              // 其他自定义 headers，例如：
              // 'Content-Type': 'application/json',
            },
          };
  
          const res = await axios.get('http://localhost:2531/api/user', config);
          console.log("res:",res)
          setUserData(res.data); // 设置 userData 状态
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // 从 cookie 中获取指定名称的值
    const getCookie = (name) => {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name))
        .split('=')[1];
      return cookieValue;
    };
  
    // 返回 userData 数据
    return <>{userData && <p>User role: {userData.role}</p>}</>;
  }
  
  export default Role;
