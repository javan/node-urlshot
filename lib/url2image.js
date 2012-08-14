(function() {
  var format, fullpage, height, page, system, top, url, width, _ref;
  setTimeout(function() {
    console.warn('timeout');
    return phantom.exit(2);
  }, 30000);
  system = require('system');
  url = system.args[1];
  _ref = system.args[2].split('x'), width = _ref[0], height = _ref[1];
  top = parseInt(system.args[3]);
  fullpage = system.args[4] === 'true';
  format = system.args[5];
  page = new WebPage();
  page.viewportSize = {
    width: width,
    height: height
  };
  if (!fullpage) {
    page.clipRect = {
      top: top,
      width: width,
      height: height
    };
  }
  page.open(url, function(status) {
    if (status === 'success') {
      console.log(page.renderBase64(format));
      return phantom.exit();
    } else {
      console.warn(status);
      return phantom.exit(1);
    }
  });
}).call(this);
