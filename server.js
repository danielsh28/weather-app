'use strict';
exports.__esModule = true;
var http = require('http');
var fs = require('fs');
var url = require('url');
var fileTypes = {
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json'
};
var port = 8080;
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    // load index.html
    if (q.pathname === '/') {
        fs.readFile('index.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
        //load files
    }
    else {
        var fileName = q.pathname.substr(1);
        var fileExt = fileName.split('.').pop();
        var contentType_1 = fileTypes[fileExt];
        if (contentType_1) {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    res.writeHead(404, { 'Content-Type': contentType_1 });
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': contentType_1 });
                    res.write(data);
                    res.end();
                }
            });
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end();
        }
        // Load API
    }
}).listen(port, function () {
    console.log('Client is available at http://localhost:' + port);
});
