
function delay (fn, t) { setTimeout(fn, t || 500) }

export default {
  getFiles: (cb) => {
    delay(() => loadJSON('v1/files', cb))
  },
  fetchPage: (name, cb) => {
    delay(() => loadJSON('v1/page/' + name, cb))
  },
  updatePage: (name, content, cb) => {
    delay(() => { PUT('/v1/page', { name, content }, cb) })
  }
}

function PUT (url, object, cb) {
  var xhr = new window.XMLHttpRequest()
  xhr.open('PUT', url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = () => { if (xhr.status === 200) cb(JSON.parse(xhr.responseText)) }
  xhr.send(JSON.stringify(object))
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
