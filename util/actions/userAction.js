"use server"
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
// 增加
export const addUser = async (prevState, formData) => {

  const email = formData.get('email');
  const password = formData.get('password');
  const res = await fetch("http://localhost:2531/register", {
    method: 'POST',
    headers: {

      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();

  if (json.success) {

    revalidatePath('/users');
  } else {
    return json.error;
  }
};

// 修改
export const editUser = async (id, formData) => {
  const email = formData.get('email');
  const password = formData.get('password');
  console.log("email", email, "password", password);
  
  const res = await fetch(`http://localhost:2531/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (json.success) {
    revalidatePath('/users');
    return json;
  } else {
    return json.error;
  }
};

// 删除
export const delUser = async (id, formData) => {

  const res = await fetch(`http://localhost:2531/delete/${id}`, {
    method: 'put',
    headers: {

      'Content-Type': 'application/json',
    },
  });
  const json = await res.json();

  if (json.success) {
    redirect("/users");
  } else {
    return json.error;
  }
};
  