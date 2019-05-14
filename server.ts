'use strict';
import {UrlWithParsedQuery} from "url";
import {IncomingMessage, ServerResponse} from "http";

const http = require('http');
const fs = require('fs');
const url = require('url');
const fileTypes = {
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'png': 'image/png'
};
const port = 8080;
const RESOURCE_NOT_FOUND_CODE = 404;
const OK_CODE=200;


http.createServer(function (req :IncomingMessage, res:ServerResponse ) {
    let q : UrlWithParsedQuery  = url.parse(req.url, true);
    let fileName :string;
    let fileExt :string;
    let contentType :string;
    // load index.html
    if (q.pathname === '/') {
        fileName = 'index.html';
        fileExt = 'html';

    } else {
        fileName = q.pathname.substr(1);
        fileExt = fileName.split('.').pop();
    }
    contentType = fileTypes[fileExt];
    if (contentType) {
        fs.readFile(`public/${fileName}`, function(err :NodeJS.ErrnoException , data : Buffer):void {
            if (err) {
                res.writeHead(RESOURCE_NOT_FOUND_CODE, {'Content-Type': contentType});
                res.end();
            } else {
                res.writeHead(OK_CODE, {'Content-Type': contentType});
                res.write(data);
                res.end();
            }
        });
    } else {
        res.writeHead(RESOURCE_NOT_FOUND_CODE, {'Content-Type': 'text/html'});
        res.end();
    }


}).listen(port, function ():void {
    console.log('Weather-app is available at http://localhost:' + port);
});