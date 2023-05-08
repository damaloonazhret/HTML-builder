const fs = require('node:fs');
const path = require('node:path');

const directory = path.join(__dirname, 'files');
const directoryCopy = path.join(__dirname, 'files-copy');

async function copyDir (dir, copy){
    try{
        await fs.readdir(directoryCopy, {withFileTypes: true}, (err, files) => {
            if (files == undefined){
                return;
            } else {
                files.forEach((file) => {
                    fs.unlink(path.join(directoryCopy, file.name), err => {
                        if (err) {
                            return err;
                        };
                    });
                });
            }

        });
    } catch {
        console.log('Creating folder');
    } finally {
        fs.readdir(directory, {withFileTypes: true}, (err, files) => {
            if (err) {
                console.log(err);
            } else {
                fs.mkdir(directoryCopy, {recursive: true}, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        files.forEach((file) => {
                            fs.copyFile(path.join(__dirname, 'files', file.name),
                                path.join(__dirname, 'files-copy', file.name), (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        });
                    }
                });
            }
        });
    }
}

copyDir(directory, directoryCopy);