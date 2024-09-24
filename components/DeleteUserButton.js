import { delUser } from '../util/actions/userAction';
import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';

function DeleteUserButton({ id, onUserDeleted }) {
  const removeUserWithId = async (e) => {
    e.preventDefault();
    try {
      await delUser(id);
      message.success('删除成功');
      if (onUserDeleted) {
        onUserDeleted(id);
      }
    } catch (error) {
      message.error('删除失败');
      console.error("删除失败", error);
    }
  };

  return (
    <Popconfirm
      title="确定删除吗？"
      onConfirm={removeUserWithId}
      okText="是"
      cancelText="否"
    >
      <Button icon={<DeleteOutlined />} type="primary" danger>
        删除
      </Button>
    </Popconfirm>
  );
}

export default DeleteUserButton;
