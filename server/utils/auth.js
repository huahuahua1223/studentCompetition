const pool = require('./db')
async function checkUserPermissions(req, res, next) {
    // console.log(req.headers.host)
  const userId = req.headers.id;
  

  if (!userId) {
    // console.log("role:",req.role)
    req.role = null;
    return next();
  }

  try {
    const [rows] = await pool.query('SELECT role FROM userinfo WHERE id = ?', [userId]);

    if (rows.length === 0) {
      req.role = null;
    } else {
      req.role = rows[0];
    }

    next();
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = checkUserPermissions;
