const aiService = require('../services/aiService');

exports.getDashboard = (req, res) => {
    res.render('dashboard', { user: req.session.user });
};

exports.getEditor = (req, res) => {
    res.render('editor', { user: req.session.user });
};

exports.chat = async (req, res) => {
    try {
        const { message, currentHtml } = req.body;

        const result = await aiService.processChat(message, currentHtml);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
