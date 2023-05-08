const fs = require('node:fs');
const path = require('node:path');

const stylesFolder = path.join(__dirname, "styles");
const bundleFolder = path.join(__dirname, "project-dist", "bundle.css");

const OUTPUT = fs.createWriteStream(bundleFolder);

async function bundle(style) {
    const allStyles = await fs.promises.readdir(style, {withFileTypes: true});
    for (const currentStyle of allStyles) {
        const N = currentStyle.name;
        const position = N.indexOf('.');
        const ext = N.slice(-(N.length - position) + 1);
        if (ext === 'css') {
            await fs.createReadStream(path.join(style, currentStyle.name))
                .on('data', data => OUTPUT.write(data));
        }
    }
}

bundle(stylesFolder).then(r => {
    console.log('\nSuccessful\n');
});