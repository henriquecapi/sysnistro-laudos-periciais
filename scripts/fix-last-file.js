const fs = require('fs');
const path = require('path');

const dir = './data/knowledge';

fs.readdirSync(dir).forEach(file => {
    const oldPath = path.join(dir, file);
    let newName = file.replace('Abitos', 'obitos');

    if (newName !== file) {
        const newPath = path.join(dir, newName);
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${file} -> ${newName}`);
        } catch (err) {
            console.error(`Error renaming ${file}:`, err.message);
        }
    }
});

console.log('Done!');
