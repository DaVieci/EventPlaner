/**
 * Prototypes by "The Net Ninja" for simply reading and writing files with JS/TS
 * @param path: 'path/to/file
 * @param text: 'some text to wirte into the file'
 */

 const fs = require('fs');

 //reading file
 function readFile(path) {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data.toString());
     });
 }

 //writing file
 function writeFile(path, text) {
    fs.writeFile(path, text, () => {
        console.log('file was written');
    });
 }

 //directories
 function createDirectory(path) {
     if (!fs.existSync(path)) {
        fs.mkdir(path, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('folder created');
         });
     } else {
         fs.rmdir(path, (err) => {
             if (err) {
                 console.log(err);
             }
             console.log('folder deleted');
         });
     }
 }

 //delete files
 function deleteFile(path) {
     if (fs.existSync(path)) {
         fs.unlink(path, (err) => {
             if (err) {
                 console.log(err);
             }
             console.log('file deletd');
         });
     }
 }