http    = require 'http'
url     = require 'url'
child   = require 'child_process'
fs      = require 'fs'

index = fs.readFileSync 'public/index.html'

server = http.createServer()
server.listen process.env.PORT or 8888

server.on 'request', (request, response) ->
  params = url.parse(request.url, true).query

  imageurl = params.url
  viewport = params.viewport or '1024x768'
  scrollto = params.scrollto or 0
  fullpage = params.fullpage in ['1', 'true']
  format   = if params.format in ['png', 'jpg'] then params.format else 'png'

  if params.url
    url2image = child.spawn 'phantomjs', ['lib/url2image.js', imageurl, viewport, scrollto, fullpage, format]
    imageData = ''

    url2image.stdout.on 'data', (data) ->
      imageData += data

    url2image.on 'exit', (code) ->
      mimeHeader = 'Content-Type': "image/#{format}"

      if code is 0
        response.writeHead 200, mimeHeader
        response.end new Buffer imageData.toString().replace(/\n/, ''), 'base64'
      else
        response.writeHead 500, mimeHeader
        response.end()
  else
    response.writeHead 200, 'Content-Type': 'text/html'
    response.end index
