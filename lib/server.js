(function() {
  var child, fs, http, index, server, url;
  http = require('http');
  url = require('url');
  child = require('child_process');
  fs = require('fs');
  index = fs.readFileSync('public/index.html');
  server = http.createServer();
  server.listen(process.env.PORT || 8888);
  server.on('request', function(request, response) {
    var format, fullpage, imageData, imageurl, mimeHeader, params, scrollto, url2image, viewport, _ref, _ref2;
    params = url.parse(request.url, true).query;
    if (imageurl = params.url) {
      viewport = params.viewport || '1024x768';
      scrollto = params.scrollto || 0;
      fullpage = (_ref = params.fullpage) === '1' || _ref === 'true';
      format = (_ref2 = params.format) === 'png' || _ref2 === 'jpg' ? params.format : 'png';
      mimeHeader = {
        'Content-Type': "image/" + format
      };
      url2image = child.spawn('phantomjs', ['lib/url2image.js', imageurl, viewport, scrollto, fullpage, format]);
      imageData = '';
      url2image.stdout.on('data', function(data) {
        return imageData += data;
      });
      return url2image.on('exit', function(code) {
        if (code === 0) {
          response.writeHead(201, mimeHeader);
          return response.end(new Buffer(imageData.toString().replace(/\n/, ''), 'base64'));
        } else {
          response.writeHead(500, mimeHeader);
          return response.end();
        }
      });
    } else if (request.url === '/' && /html/.test(request.headers.accept)) {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      return response.end(index);
    } else {
      response.statusCode = 404;
      return response.end();
    }
  });
}).call(this);
