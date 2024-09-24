// routes/submissions.js
const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionController');

router.post('/upload', submissionsController.upload, submissionsController.uploadFiles);
router.get('/:id', submissionsController.getSubmissionById);
router.get('/', submissionsController.getAllSubmissions);
router.delete('/:id', submissionsController.deleteSubmission);
router.get('/download/*', submissionsController.downloadFile); // 下载文件
// 添加新的路由来处理根据用户 ID 获取提交记录的请求
router.get('/users/:userId', submissionsController.getSubmissionsByUserId);

module.exports = router;
