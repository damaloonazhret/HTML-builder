const fs = require('node:fs');
const path = require('node:path');
const {stdout, stdin} = process;

let fileName = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('\n To leave press "Ctrl + C" \n Enter data:\n\n');

stdin.on('data', (text) => {
    fileName.write(text);
});

process.on('SIGINT', () => {
    stdout.write('Successful write data');
    process.exit();
});