// controllers/submissionsController.js
const Submission = require('../model/submissionModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 文件上传目录
const uploadDir = path.join(__dirname, '../uploads');
// 检查目录是否存在，如果不存在则创建
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.log(file)
        // 生成唯一的文件名前缀
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // 解码文件名
        const decodedFileName = decodeURIComponent(file.originalname);
        console.log(decodedFileName)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

exports.uploadFiles = async (req, res) => {
    try {
        const { registrationId } = req.body;
        const files = req.files;

        // let fileUrl = null;
        // let fileName = null;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const submissionId = await Submission.create({ registrationId }, files);
        res.status(201).json({ id: submissionId });
    } catch (error) {
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
};

exports.getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await Submission.getById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve submission', error: error.message });
    }
};

exports.getAllSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.getAll();
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve submissions', error: error.message });
    }
};

exports.getSubmissionsByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
      const submissions = await Submission.getByUserId(userId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: '获取上传文件列表失败', error: error.message });
    }
  };

exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Submission.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(200).json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete submission', error: error.message });
    }
};

exports.downloadFile = (req, res) => {
    const fileUrl = req.params[0]; // 使用 [0] 获取 URL 中的通配符部分
    const filePath = path.join(__dirname, '..', fileUrl);

    console.log(filePath)
    // 确保文件存在
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
    }

    const fileName = path.basename(filePath);

    res.download(filePath, fileName, (err) => {
        if (err) {
            if (err.code === 'ECONNABORTED') {
                console.warn('File download aborted:', err);
            } else {
                console.error('File download failed:', err);
                res.status(500).json({ message: 'File download failed', error: err.message });
            }
        }
    });
};

exports.upload = upload.array('files', 10); // 限制最多上传10个文件