const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '../../data/knowledge');

exports.getKnowledgeBase = (req, res) => {
    fs.readdir(KNOWLEDGE_DIR, (err, files) => {
        if (err) {
            console.error(err);
            return res.render('knowledge', { user: req.session.user, files: [] });
        }

        const fileData = files.map(file => {
            const stats = fs.statSync(path.join(KNOWLEDGE_DIR, file));
            return {
                name: file,
                ext: path.extname(file).substring(1),
                size: (stats.size / 1024).toFixed(2)
            };
        });

        res.render('knowledge', { user: req.session.user, files: fileData });
    });
};

exports.uploadDocument = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.redirect('/knowledge');
};
