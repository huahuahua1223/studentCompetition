import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, TrophyOutlined, TeamOutlined, SolutionOutlined, ProfileOutlined } from '@ant-design/icons';
import styles from './AppSlideMenu.module.css'; // 可选，如果需要自定义样式

function AppSlideMenu({ role }) {
  const pathname = usePathname(); // 获取当前路径
  const [selectedKeys, setSelectedKeys] = useState(['']); // 设置选中的菜单项

  useEffect(() => {
    setSelectedKeys([pathname]); // 根据当前路径设置选中的菜单项
  }, [pathname]);

  const items = [
    { label: '主页面', href: '/', icon: <AppstoreOutlined /> },
    role !== 'guest' && { label: '竞赛管理', href: '/competitions', icon: <TrophyOutlined /> },
    role === 'admin' && { label: '用户管理', href: '/users', icon: <TeamOutlined /> },
    role !== 'guest' && { label: '报名管理', href: '/registrations', icon: <SolutionOutlined /> },
    role !== 'guest' && { label: '作品管理', href: '/submissions', icon: <ProfileOutlined /> },
  ].filter(Boolean); // 过滤掉无效项

  return (
    <Menu mode="inline" selectedKeys={selectedKeys} className={styles.menu}>
      {items.map((item) => (
        <Menu.Item key={item.href} icon={item.icon}>
          <Link href={item.href}>
            {item.label}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default AppSlideMenu;
