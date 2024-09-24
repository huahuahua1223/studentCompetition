// controllers/CompetitionController.js
const Competition = require('../model/competitionModel');

// 已提供findAll函数
exports.findAll = async (req, res) => {
    try {
      const competitions = await Competition.findAll();
      res.status(200).json(competitions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// 创建新竞赛
exports.create = async (req, res) => {
  try {
    const competition = await Competition.create(req.body);
    res.status(201).json({ message: 'Competition created successfully', competition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 通过ID查找竞赛
exports.findOne = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    res.status(200).json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新竞赛
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRows = await Competition.update(id, req.body);
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    res.status(200).json({ message: 'Competition updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除竞赛
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Competition.delete(id);
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    res.status(200).json({ message: 'Competition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};