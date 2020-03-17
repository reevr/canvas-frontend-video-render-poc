const express = require('express');
const app = express();
const path = require('path');
var Busboy = require('busboy');
const fs = require('fs');

(async () => {
    app.use('/public', express.static(path.join(__dirname ,'/public')));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './public/video.html'));
    })

    app.post('/file', (req, res) => {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            const writeStream = fs.createWriteStream(path.join(__dirname, 'public', filename));
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
            file.pipe(writeStream);
        });
        busboy.on('finish', function() {
            console.log('Done parsing form!');
            res.writeHead(303, { Connection: 'close', Location: '/' });
            res.send({});
        });
        
        req.pipe(busboy);
    });

    app.get('video-link');

    app.listen('8999', () => console.log('Server started at port : 8999'));
})()
.then(() => console.log('Boot complete'))
.catch(err => console.log(err));