// controllers/userController.js
const UserInfo = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 设置multer存储配置
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir) // 存储到uploads目录
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
function formatTimestamps(data) {
  return data.map(user => {
    // 假设createdAt和updatedAt已经是形如"2024-06-05 22:16:38"的字符串
    if (user.createdAt && user.updatedAt) {
      // 直接将时间字符串转换为Date对象
      const createdDate = new Date(user.createdAt);
      const updatedDate = new Date(user.updatedAt);

      // 根据需要，可以在这里调整时区
      // 例如，如果需要转换为东八区（北京时间），可以这样做：
      user.createdAt = createdDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      user.updatedAt = updatedDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

      // 如果不需要时区转换，可以直接输出原始时间字符串
      // user.createdAt = user.createdAt; // 保持不变
      // user.updatedAt = user.updatedAt; // 保持不变
    }
    return user;
  });
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserInfo.findAll();
    // const formattedUsers = formatTimestamps(users);
    // res.json(formattedUsers);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// // 单独的头像上传路由
// exports.uploadAvatar = [
//   upload.single('avatar'),
//   (req, res) => {
//     if (req.file) {
//       const avatarUrl = `/uploads/${req.file.filename}`;
//       res.json({ success: true, url: avatarUrl });
//     } else {
//       res.status(400).send('头像上传失败');
//     }
//   }
// ];

exports.addUser = [
  upload.single('avatar'), // 单文件上传
  async (req, res) => {
    try {
      const { username, email, password, role, name, bio } = req.body;

      // 检查必需字段是否存在
      if (!username || !email || !password || !role || !name) {
        return res.status(400).send('所有字段都是必填项');
      }

      console.log("Received data:", { username, email, password, role, name, bio });
      // 使用bcrypt加密密码
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      let avatarUrl = null;
      if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
      }
      const userId = await UserInfo.create({ username, email, passwordHash, role, name, bio, avatarUrl, createdAt: new Date(), updatedAt: new Date() });
      const user = await UserInfo.findById(userId);
      const token = jwt.sign({ id: user.id, username: user.username }, 'nodejs123', { expiresIn: '30m' });
      res.status(201).json({ success: true, message: 'User added successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
];

// exports.addUser = async (req, res) => {
//   try {
//     const { username, email, password, role, name, bio, avatarUrl } = req.body;
//     console.log(req.body)

//     if (!username || !email || !password || !role || !name) {
//       return res.status(400).send('所有字段都是必填项');
//     }

//     const passwordHash = await bcrypt.hash(password, 10);

//     const newUser = new UserInfo({
//       username,
//       email,
//       password: passwordHash,
//       role,
//       name,
//       bio,
//       avatarUrl,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     const user = await newUser.save();
//     const token = jwt.sign({ id: user._id, username: user.username }, 'nodejs123', { expiresIn: '30m' });
//     res.json({ success: true, message: 'User added successfully', token });
//   } catch (error) {
//     console.error('Error in addUser:', error);
//     res.status(500).send('Server error');
//   }
// };

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserInfo.delete(id);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.updateUser = [
  upload.single('avatar'), // 单文件上传
  async (req, res) => {
    try {
      console.log(req.body)
      const { id } = req.params;
      const { username, email, name, bio } = req.body;
      // const passwordHash = await bcrypt.hash(password, 10);
      let avatarUrl = null;
      if (req.file) {
        avatarUrl = `/uploads/${req.file.filename}`;
      }
      console.log(avatarUrl)
      await UserInfo.update(id, { username, email, name, bio, avatarUrl, updatedAt: new Date() });
      res.status(200).send('User updated successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
];

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const user = await UserInfo.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserInfo.findByUserName(username);
    console.log(user)
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordMatch) {
        const token = jwt.sign({ id: user.id, username: user.username }, 'nodejs123', { expiresIn: '30m' });
        const expiresIn = 1800;
        const expires = Date.now() + expiresIn * 1000;
        const id = user.id;
        const role = user.role;
        res.status(200).json({ success: true, message: 'Login successful', token, expires, id, role });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// exports.register = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     console.log(username,password)
//     const passwordHash = await bcrypt.hash(password, 10);
//     const userId = await UserInfo.create({ username, email, passwordHash, role });
//     const user = await UserInfo.findById(userId);
//     const token = jwt.sign({ id: user.id, username: user.username }, 'nodejs123', { expiresIn: '30m' });
//     res.json({ success: true, message: 'Registration successful', token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// };