# Exit if the script takes longer than 30 seconds
setTimeout ->
  console.warn 'timeout'
  phantom.exit 2
, 30000

system = require 'system'

url             = system.args[1]
[width, height] = system.args[2].split 'x'
top             = parseInt system.args[3]
fullpage        = system.args[4] is 'true'
format          = system.args[5]

page = new WebPage()
page.viewportSize = {width, height}
page.clipRect = {top, width, height} unless fullpage

page.open url, (status) ->
  if status is 'success'
    console.log page.renderBase64 format
    phantom.exit()
  else
    console.warn status
    phantom.exit 1