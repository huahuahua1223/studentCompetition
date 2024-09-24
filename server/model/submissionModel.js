// models/Submission.js
const db = require('../utils/db');
const path = require('path');

class Submission {
  static async create(submission, files) {
    const { registrationId } = submission;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        'INSERT INTO submissions (registrationId, uploadTime) VALUES (?, NOW())',
        [registrationId]
      );
      const submissionId = result.insertId;

      for (const file of files) {
        console.log("file:", file)
        const filePath = path.join('/uploads', file.filename); // 构造相对路径
        await connection.query(
          'INSERT INTO submission_files (submissionId, fileUrl, fileName) VALUES (?, ?, ?)',
          [submissionId, filePath, decodeURIComponent(file.originalname)]
        );
      }

      await connection.commit();
      return submissionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM submissions WHERE id = ?', [id]);
    if (rows.length === 0) {
      return null;
    }

    const submission = rows[0];
    const [files] = await db.query('SELECT * FROM submission_files WHERE submissionId = ?', [id]);
    submission.files = files;
    return submission;
  }

  static async getByRegistrationId(registrationId) {
    const [rows] = await db.query('SELECT * FROM submissions WHERE registrationId = ?', [registrationId]);
    if (rows.length === 0) {
      return null;
    }

    const submissions = [];
    for (const row of rows) {
      const [files] = await db.query('SELECT * FROM submission_files WHERE submissionId = ?', [row.id]);
      row.files = files;
      submissions.push(row);
    }

    return submissions;
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM submissions');
    const submissions = [];
    for (const row of rows) {
      // 获取 registrationId 对应的 userId
      const [registrationRow] = await db.query('SELECT userId, competitionId FROM registrations WHERE id = ?', [row.registrationId]);
      if (registrationRow) {
          const userId = registrationRow[0].userId;
          const competitionId = registrationRow[0].competitionId;

          // 获取 competitionId 对应的 competition title
          const [competitionRow] = await db.query('SELECT title FROM competitions WHERE id = ?', [competitionId]);
          if (competitionRow) {
              row.competitionTitle = competitionRow[0].title;
          } else {
              row.competitionTitle = null;
          }

          // 获取 userId 对应的 username
          const [userRow] = await db.query('SELECT username FROM userinfo WHERE id = ?', [userId]);
          if (userRow) {
              row.username = userRow[0].username;
          } else {
              row.username = null;
          }
      } else {
          row.username = null;
      }

      // 获取 submission_files
      const [files] = await db.query('SELECT * FROM submission_files WHERE submissionId = ?', [row.id]);
      row.files = files;
      submissions.push(row);
    }

    return submissions;
  }

  static async getByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM submissions WHERE registrationId IN (SELECT id FROM registrations WHERE userId = ?)', [userId]);
    const submissions = [];
    for (const row of rows) {
      const [files] = await db.query('SELECT * FROM submission_files WHERE submissionId = ?', [row.id]);
      const [registration] = await db.query('SELECT userId, competitionId FROM registrations WHERE id = ?', [row.registrationId]);
      const [user] = await db.query('SELECT username FROM userinfo WHERE id = ?', [registration[0].userId]);
      const [competition] = await db.query('SELECT title FROM competitions WHERE id = ?', [registration[0].competitionId]);
      row.files = files;
      row.username = user[0].username;
      row.competitionTitle = competition[0].title;
      submissions.push(row);
    }
    return submissions;
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('DELETE FROM submission_files WHERE submissionId = ?', [id]);
      const [result] = await connection.query('DELETE FROM submissions WHERE id = ?', [id]);
      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Submission;
