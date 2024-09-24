// models/userModel.js
const db = require('../utils/db');
const jwt = require('jsonwebtoken');

class UserInfo {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM userinfo WHERE status = 0');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM userinfo WHERE id = ? AND status = 0', [id]);
    return rows[0];
  }

  static async findByUserName(username) {
    const [rows] = await db.query('SELECT * FROM userinfo WHERE username = ? AND status = 0', [username]);
    return rows[0];
  }

  static async create(data) {
    const { username, email, passwordHash, role, name, bio, avatarUrl, createdAt, updatedAt } = data;
    const [result] = await db.query(
      'INSERT INTO userinfo (username, email, passwordHash, role, name, bio, avatarUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, passwordHash, role, name, bio, avatarUrl, createdAt, updatedAt]
    );
    return result.insertId;
  }

  static async update(id, data) {
    // const [result] = await db.query('UPDATE userinfo SET username = ?, passwordHash = ? WHERE id = ?', [data.username, data.passwordHash, id]);
    const [result] = await db.query('UPDATE userinfo SET ? WHERE id = ?', [data, id]);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('UPDATE userinfo SET status = 1 WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const secret = 'nodejs123'; // 请替换为你自己的密钥
    const token = jwt.sign(payload, secret, { expiresIn: '30m' });
    return token;
  }

  static async login(username, passwordHash) {
    const [rows] = await db.query('SELECT * FROM userinfo WHERE username = ? AND passwordHash = ? AND status = 0', [username, passwordHash]);
    return rows[0];
  }
}

module.exports = UserInfo;
