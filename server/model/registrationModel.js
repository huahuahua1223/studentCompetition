const db = require('../utils/db');

class Registration {
  static async findRegistrationByUC(userId,competitionId) {
    const [rows] = await db.query('SELECT * FROM registrations where userId = ? and competitionId = ?', [userId,competitionId]);
    return rows;
  }
  static async findAll() {
    const query = `
  SELECT 
    r.id,
    r.userId,
    u.username,
    r.competitionId,
    c.title AS competitionTitle,
    r.status,
    r.registrationTime,
    r.notes,
    r.reviewTime
  FROM 
    registrations r
  JOIN 
    userinfo u ON r.userId = u.id
  JOIN 
    competitions c ON r.competitionId = c.id;
`;
    const [rows] = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM registrations WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM registrations WHERE userId = ?', [userId]);
    return rows;
  }

  static async create(data) {
    const [result] = await db.query('INSERT INTO registrations SET ?', [data]);
    return result.insertId;
  }

  static async update(id, data) {
    const [result] = await db.query('UPDATE registrations SET ? WHERE id = ?', [data, id]);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM registrations WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Registration;