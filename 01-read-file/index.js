const fs = require('node:fs');
const path = require('node:path');
const { stdout } = process;

let fileName = path.join(__dirname, 'text.txt');
let result = '';

fs.createReadStream(path.join(fileName), 'utf-8')

  .on('data', function (chunk) {
    result += chunk;
  })

  .on('end', function () {
    stdout.write(result);
  });