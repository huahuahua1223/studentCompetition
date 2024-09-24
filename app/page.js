'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Button, message } from 'antd';
import Cookies from 'js-cookie';
import axios from 'axios';
export default function Home() {
  const [role, setRole] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const roleFromCookie = Cookies.get("Role");
    const userId = Cookies.get("Id");
    console.log("Role from cookie:", roleFromCookie);
    setRole(roleFromCookie);

    if (userId) {
      axios.get(`http://localhost:2531/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`
        }
      })
        .then(response => {
          console.log("User data:", response.data);
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          message.error('Error fetching user data');
        });
    }
  }, []);

  return (
    // <div>
    //   <h1>Welcome to my app</h1>
    //   <Button type="primary">Homepage</Button>
    // </div>

    // <div className={styles.container}>
    //   <h1 className={styles.title}>Welcome to Our Homepage</h1>
    //   <p className={styles.description}>This is the description for the homepage.</p>
    // </div>
    <div className={styles.container}>
      <br /><br /><br />
      <div className={styles.wide}>
        <div className={styles.bounce}>
          <span className={styles.letter}>欢</span>
          <span className={styles.letter}>迎</span>
          <span className={styles.letter}>进</span>
          <span className={styles.letter}>入</span>
        </div>
        <div className={styles.bounce}>
          <span className={styles.letter}>学</span>
          <span className={styles.letter}>生</span>
          <span className={styles.letter}>竞</span>
          <span className={styles.letter}>赛</span>
          <span className={styles.letter}>管</span>
          <span className={styles.letter}>理</span>
          <span className={styles.letter}>平</span>
          <span className={styles.letter}>台</span>
          {/* <span className={styles.letter}>台</span> */}
        </div>
        <div className={styles.loginBox}>
          <ul>
            <p><br /></p>
            <div className={`${styles.loginTxt} ${styles.taC} ${styles.f16} ${styles.mb10}`}>
              <p className={`${styles.taC} ${styles.mb10}`}></p>
              <p className={`${styles.taC} ${styles.mb10}`}>
                <div className={`${styles.txBtn} ${styles.txBtnBig} ${styles.dpB} ${styles.bgRed}`}>
                  <span>当前角色: {role === 'admin' ? '管理员' : '用户'}</span>
                </div>
              </p>
              <p className={`${styles.taC} ${styles.mb10}`}>
                {/* <a href="/profile" className={`${styles.txBtn} ${styles.txBtnBig} ${styles.dpB} ${styles.bgRed}`}>
                  {user && <span>当前用户名: {user.username}</span>}
                </a> */}
                <div className={`${styles.txBtn} ${styles.txBtnBig} ${styles.dpB} ${styles.bgRed}`}>
                {user && <span>当前用户名: {user.username}</span>}
                </div>
              </p>
              <p className={`${styles.taC} ${styles.mb10}`}>
                <a href="/profile" className={`${styles.txBtn} ${styles.txBtnBig} ${styles.dpB} ${styles.bgRed}`}>
                个人资料
                </a>
              </p>
              {/* <p className={`${styles.taC} ${styles.mb10}`}>
                <a href="https://www.bootstrapmb.com/" target="_blank" className={`${styles.txBtn} ${styles.txBtnBig} ${styles.dpB} ${styles.bgRed}`}>
                  永久网址：https://www.bootstrapmb.com/
                </a>
              </p>
              <p className={`${styles.taC} ${styles.mb10}`}>
                <a href="https://www.bootstrapmb.com/" target="_blank" className={`${styles.txBtn} ${styles.txBtnBig} ${styles.dpB} ${styles.bgRed}`}>
                  最新地址三：www.163.com
                </a>
              </p> */}
              <p>^_^ 电脑端请 Ctrl+D 收藏本页到浏览器收藏夹<br />^_^ 手机端请将本页添加到浏览器收藏夹或书签</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
