const express = require('express');
const registrationController = require('../controllers/registrationController');
const router = express.Router();

router.get('/', registrationController.findAll);
router.get('/:id', registrationController.findOne);
router.post('/', registrationController.create); // 用户报名
router.put('/:id', registrationController.update);
router.delete('/:id', registrationController.delete);

router.get('/:userId/:competitionId', registrationController.findRegistration); // 获取用户竞赛报名信息


module.exports = router;