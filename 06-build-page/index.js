const fs = require('node:fs');
const path = require('node:path');
const fsPromises = require('node:fs/promises');

const distFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const assetsCopyFolder = path.join(__dirname, 'project-dist', 'assets');
const stylesFolder = path.join(__dirname, 'styles');
const bundleFolder = path.join(__dirname, 'project-dist', 'style.css');
const templateFolder = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const distHTMLFolder = path.join(__dirname, 'project-dist', 'index.html');
const OUTPUT = fs.createWriteStream(bundleFolder);


async function createFolder() {
    await fsPromises.mkdir(distFolder, {recursive: true});
}

async function copyDir(dir, copy) {

    await fs.readdir(copy, {withFileTypes: true}, (err, files) => {

        if (files == undefined) {
            return;
        } else {

            files.forEach((file) => {
                fs.unlink(path.join(copy, file.name), err => {
                    if (err) {
                        return err;
                    }
                });
            });

        }

    });

    fs.readdir(dir, {withFileTypes: true}, (err, files) => {

        if (err) {
            console.log(err);
        } else {
            fs.mkdir(copy, {recursive: true}, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    files.forEach((file) => {
                        fs.copyFile(path.join(dir, file.name),
                            path.join(copy, file.name), (err) => {
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

async function copyFolder(dir, copy) {

    await fs.readdir(dir, {withFileTypes: true}, (err, folders) => {

        if (err) {
            console.log(err);
        } else {
            fs.mkdir(copy, {recursive: true}, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    folders.forEach(async (folder) => {
                        let dirPath = path.join(dir, folder.name);
                        let copyDirPath = path.join(copy, folder.name);
                        await copyDir(dirPath, copyDirPath);
                    });
                }
            });
        }

    });

}

async function bundleStyles(style) {

    const stylesPack = await fs.promises.readdir(style, {withFileTypes: true});

    for (const currentStyle of stylesPack) {
        const Num = currentStyle.name;
        const position = Num.lastIndexOf('.');
        const ext = Num.slice(-(Num.length - position) + 1);
        if (ext === 'css') {
            await fs.createReadStream(path.join(style, currentStyle.name))
                .on('data', data => OUTPUT.write(data));
        }
    }

}

async function createHTML(template, components) {

    let templateHTML = await fs.promises.readFile(template, 'utf8');

    await fs.readdir(components, {withFileTypes: true}, (err, folders) => {

        folders.forEach(async (item) => {
            const itemName = item.name;
            const position = itemName.indexOf('.');
            const name = itemName.slice(0, position);
            let fileName = path.join(components, itemName);
            const output = fs.createWriteStream(distHTMLFolder);
            await fs.createReadStream(path.join(fileName), 'utf-8')
                .on('data', function (chunk) {
                    templateHTML = templateHTML.replace(`{{${name}}}`, chunk.toString());
                    output.write(templateHTML);
                });
        });

    });

}


createFolder().then(() => {
    console.log('Folder creation successful');
});
copyFolder(assetsFolder, assetsCopyFolder).then(() => {
    console.log('Folder copy successful');
});
bundleStyles(stylesFolder).then(() => {
    console.log('Copy styles successful');
});
createHTML(templateFolder, componentsFolder).then(() => {
    console.log('Creation HTML successful');
});