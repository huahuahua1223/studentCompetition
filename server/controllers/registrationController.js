const Registration = require('../model/registrationModel');

// 所有报名信息
exports.findAll = async (req, res) => {
  try {
    const registrations = await Registration.findAll();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 创建新的报名信息
exports.create = async (req, res) => {
  try {
    const registration = await Registration.create(req.body);
    res.status(201).json({ message: 'Registration created successfully', registration });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// 通过用户ID查找报名信息
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await Registration.findByUserId(id);
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 通过用户ID和竞赛查找报名信息
exports.findRegistration = async (req, res) => {
  try {
    const { userId,competitionId } = req.params;
    const status = await Registration.findRegistrationByUC(userId,competitionId);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新报名
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRows = await Registration.update(id, { status, reviewTime: new Date() });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.status(200).json({ message: 'Registration updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除报名
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Registration.delete(id);
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

