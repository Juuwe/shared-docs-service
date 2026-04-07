const express = require('express');
const router = express.Router();
const docsController = require('../controllers/docsController');

// Определение маршрутов для работы с документами
router.get('/', docsController.getAllDocs);
router.get('/:id', docsController.getDocById);
router.post('/', docsController.createDoc);
router.patch('/:id', docsController.updateDoc);
router.delete('/:id', docsController.deleteDoc);

module.exports = router;
