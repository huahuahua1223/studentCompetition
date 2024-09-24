// utils/tokenUtils.js
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

const isTokenExpired = (token) => {
  try {
    message.info('正在检查登录状态...');
    // console.log("Decoding token:", token);
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    const isExpired = Date.now() >= exp * 1000;
    if (isExpired) {
      message.warning('您的会话已过期，请重新登录');
    }
    return isExpired;
  } catch (e) {
    // alert(e)
    message.error('Token 解析失败');
    console.error('Error decoding token:', e);
    return true;
  }
};

const clearCookies = () => {
  Cookies.remove('Role');
  Cookies.remove('Authorization');
  Cookies.remove('Id');
};

const checkAndClearExpiredToken = () => {
  const token = Cookies.get('Authorization');
  console.log("token:",token)
  if (token && isTokenExpired(token)) {
    clearCookies();
    // alert("已过期")
    message.warning('您的会话已过期，请重新登录');
    window.location.href = '/';
  }
};

export const startTokenExpiryCheck = () => {
  checkAndClearExpiredToken();
  setInterval(checkAndClearExpiredToken, 5 * 60 * 1000); // 每5分钟检查一次
};
