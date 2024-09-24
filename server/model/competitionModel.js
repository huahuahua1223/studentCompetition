// models/Competition.js
const db = require('../utils/db');

class Competition {
  // 所有竞赛
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM competitions');
    return rows;
  }

  // 单个竞赛
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM competitions WHERE id = ?', [id]);
    return rows[0];
  }

  // 增加
  static async create(data) {
      const [result] = await db.query('INSERT INTO competitions SET ?', [data]);
      return result.insertId;
  }

  // 修改
  static async update(id, data) {
    const [result] = await db.query('UPDATE competitions SET ? WHERE id = ?', [data, id]);
    return result.affectedRows;
  }

  // 删除
  static async delete(id) {
    const [result] = await db.query('DELETE FROM competitions WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Competition;