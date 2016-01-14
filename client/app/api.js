
export default {
  getFiles: (cb) => {
    loadJSON('v1/files', cb)
  },
  fetchPage: (name, cb) => {
    loadJSON('v1/page/' + name, cb)
  }
}

function loadJSON (path, cb) {
  var req = new window.XMLHttpRequest()
  req.overrideMimeType('application/json')
  req.open('GET', path, true)
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) cb(JSON.parse(req.responseText))
  }
  req.send()
}
