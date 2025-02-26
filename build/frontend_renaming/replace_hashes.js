const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcDirs = ['../../dist/src/06/01', '../../dist/src/06/02'];

// Function to generate a random hash
function generateRandomHash() {
    return crypto.randomBytes(16).toString('hex');
}

// Function to copy, rename, and delete the original file
function copyRenameAndDeleteFile(srcDir, file) {
    const srcPath = path.join(srcDir, file);
    let newFileName;

    if (file.includes('.smim')) {
        newFileName = generateRandomHash() + '.smim.xml';
    } else if (file.includes('.sicf')) {
        const parts = file.split(' ');
        const prefix = parts.slice(0, -1).join(' ').trim() + ' ';
        const hashLength = 48 - prefix.length - '.sicf.xml'.length;
        const hash = generateRandomHash().substring(0, hashLength);
        newFileName = prefix + hash + '.sicf.xml';
    } else {
        console.log(`File does not include '.smim' or '.sicf': ${file}`);
        return;
    }

    const destPath = path.join(srcDir, newFileName);

    console.log(`Copying ${file} to ${newFileName}`);

    fs.copyFile(srcPath, destPath, err => {
        if (err) {
            console.error('Error copying file:', err);
        } else {
            console.log(`Copied and renamed ${file} to ${newFileName}`);

            // Delete the original file
            fs.unlink(srcPath, err => {
                if (err) {
                    console.error('Error deleting original file:', err);
                } else {
                    console.log(`Deleted original file ${file}`);
                }
            });
        }
    });
}

// Function to copy, rename, and delete files in the directory
function copyRenameAndDeleteFiles(srcDir) {
    fs.readdir(srcDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => copyRenameAndDeleteFile(srcDir, file));
    });
}

// Ensure the source directories exist and process files
srcDirs.forEach(srcDir => {
    fs.access(srcDir, fs.constants.F_OK, err => {
        if (err) {
            console.error(`Source directory ${srcDir} does not exist:`, err);
            return;
        }

        // Copy, rename, and delete files
        copyRenameAndDeleteFiles(srcDir);
    });
});