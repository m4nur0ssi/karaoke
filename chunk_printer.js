const fs = require('fs');

function printChunks(name, filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const chunkSize = 5000;
    console.log(`=== START ${name} ===`);
    for (let i = 0; i < content.length; i += chunkSize) {
        console.log(`CHUNK:${name}:${content.substring(i, i + chunkSize)}`);
    }
    console.log(`=== END ${name} ===`);
}

printChunks('SCRIPT', 'script.js');
printChunks('STYLE', 'style.css');
