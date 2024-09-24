// loginAction.js
"use server";
import { redirect } from "next/navigation";

const url = "http://localhost:2531/users/login"

export default async function loginAction(formData) {
  console.log("进入 loginAction");
  const username = formData.username;
  const password = formData.password;
  console.log("表单数据", username, password);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  const json = await res.json();

  if (res.ok) {
    return json;
  } else {
    throw new Error(json.error);
  }
}
