const fs = require('node:fs');
const path = require('node:path');

const directory = path.join(__dirname, 'secret-folder');

fs.readdir(directory, {withFileTypes: true}, (err, files) => {
    if (err) {
        console.log(err);
    } else {
        console.log("\nCurrent directory filenames:");
        files.forEach(file => {
            if (file.isFile()) {
                const N = file.name;
                const position = N.indexOf('.');
                const name = N.slice(0, position);
                const ext = N.slice(-(N.length - position)+1);
                const filePath = path.join(directory, file.name);
                fs.stat(filePath, (err, file) => {
                    console.log(`${name} - ${ext} - ${(file.size)} bytes`);
                });
            }
        });
    }
});