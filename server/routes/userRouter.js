const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// 获取token头部
function getTokenFromHeader(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'nodejs123'); // 解码并验证token
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.token = token; // 将token存储在请求对象中，以便后续处理
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// // 角色中间件
// async function checkUserPermissions(req, res, next) {
//     const userId = req.cookies.userId;
  
//     if (!userId) {
//       req.user = null;
//       return next();
//     }
  
//     try {
//       const [rows] = await pool.query('SELECT role FROM userinfo WHERE id = ?', [userId]);
  
//       if (rows.length === 0) {
//         req.user = null;
//       } else {
//         req.user = rows[0];
//       }
  
//       next();
//     } catch (error) {
//       console.error('Database error:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }

router.get('/', getTokenFromHeader, userController.getAllUsers);
router.get('/:id', getTokenFromHeader, userController.getUserById);
router.post('/login', userController.login);
// router.post('/upload-avatar', userController.uploadAvatar);
router.post('/register', userController.addUser);
router.put('/update/:id', userController.updateUser);
router.put('/delete/:id', userController.deleteUser);

module.exports = router;
