const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const knowledgeController = require('../controllers/knowledgeController');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/knowledge/');
    },
    filename: (req, file, cb) => {
        // Keep original name, maybe prevent duplicates in future
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Auth Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// Protected Routes
router.use(isAuthenticated); // Apply to all below

router.get('/', (req, res) => {
    res.redirect('/dashboard');
});

router.get('/dashboard', reportController.getDashboard);
router.get('/editor', reportController.getEditor);
router.post('/api/chat', reportController.chat);

router.get('/knowledge', knowledgeController.getKnowledgeBase);
router.post('/knowledge/upload', upload.single('document'), knowledgeController.uploadDocument);

module.exports = router;
