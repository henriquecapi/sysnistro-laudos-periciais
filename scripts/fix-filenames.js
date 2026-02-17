const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '../data/knowledge');

console.log('Renomeando arquivos com problemas de encoding...\n');

const files = fs.readdirSync(KNOWLEDGE_DIR);

files.forEach(file => {
    const oldPath = path.join(KNOWLEDGE_DIR, file);

    // Substituir caracteres com problemas de encoding
    let newName = file
        .replace(/Ã©/g, 'e')
        .replace(/Ã£/g, 'a')
        .replace(/Ã¡/g, 'a')
        .replace(/Ã³/g, 'o')
        .replace(/Ãº/g, 'u')
        .replace(/Ã­/g, 'i')
        .replace(/Ã§/g, 'c')
        .replace(/Ã/g, 'A')
        .replace(/Ã‰/g, 'E')
        .replace(/Ãƒ/g, 'A')
        .replace(/Ã"/g, 'O')
        .replace(/Aª/g, 'e')
        .replace(/incendio/g, 'incendio')
        .replace(/Abitos/g, 'obitos');

    if (newName !== file) {
        const newPath = path.join(KNOWLEDGE_DIR, newName);
        console.log(`Renomeando: ${file} -> ${newName}`);
        fs.renameSync(oldPath, newPath);
    }
});

console.log('\nConcluído!');
