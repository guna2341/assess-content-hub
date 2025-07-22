const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { protect } = require('./middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.use(protect);

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files', fileController.getFiles);

module.exports = router;