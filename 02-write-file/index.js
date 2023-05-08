const fs = require('node:fs');
const path = require('node:path');
const {stdout, stdin} = process;

let fileName = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const exit = () => {
  stdout.write('Successful write data');
  process.exit();
};

stdout.write('\n To leave press "Ctrl + C" \n Enter data:\n\n');

stdin.on('data', (text) => {
  if(text.toString().toLowerCase().trim() === 'exit'){
    exit();
  } else {
    fileName.write(text);
  }
});

process.on('SIGINT', () => {
  exit();
});