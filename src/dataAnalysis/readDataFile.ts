import * as fs from 'fs';
const fullPath = require('./pathToDatabaseFile').fullPath;

exports.promiseOfData = new Promise( (resolve, reject) => {
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const convertBufferToString = data.toString();
            const convertStringToJSObject = JSON.parse(convertBufferToString);
            resolve(convertBufferToString);
        }
    })
})