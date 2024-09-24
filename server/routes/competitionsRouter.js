// routes/competitions.js
const express = require('express');
const CompetitionController = require('../controllers/competitionController');
const router = express.Router();

router.get('/', CompetitionController.findAll);
router.post('/', CompetitionController.create);
router.get('/:id', CompetitionController.findOne);
router.put('/:id', CompetitionController.update);
router.delete('/:id', CompetitionController.delete);

module.exports = router;