// app/users/page.js
import UserList from "../../components/UserList";
// import Role from "../../components/Role";
import { cookies } from "next/headers";
import React from 'react';
import axios from 'axios';
import { Button } from 'antd';

const url = "http://127.0.0.1:2531/users"

async function UsersPage() {
  // const [user, setUser] = useState(null);
  // 从服务器端获取 cookies
  const cookieStore = cookies();
  const token = cookieStore.get('Authorization');
  const id = cookieStore.get('Id');

  // 获取用户信息
  // const response1 = await axios.get(`http://localhost:2531/users/${id}`, {
  //   headers: {
  //     'Authorization': `Bearer ${token}`
  //   }
  // });

  // 未授权
  if (!token || !id) {
    console.error("未找到 Authorization token 或 Id");
    return <div>未授权，请登录</div>;
  }

  // 超时
  const tokenExpires = cookieStore.get('expires');
  if (new Date().getTime() > tokenExpires) {
    console.error("token 已过期");
    return <div>未授权，请登录</div>;
  }

  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  });
  
    const users = response.data;
    console.log(users)
    if (!users) {
      console.log("无用户");
    }else{
      console.log("所有用户"+users);
    }
  
    return (
      <div>
        {/* <Role user={user} /> */}
        <UserList users={users} />
      </div>
    )
 
  
}

export default UsersPage 