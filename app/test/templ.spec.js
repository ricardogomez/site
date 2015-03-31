
var templ = require('../lib/templ');

describe('Templ', function() {
  it("replaces strings", function() {
    var ctx = function(e) { return e.toUpperCase(); }
    expect(templ("Esto es {{a}}", ctx)).toEqual("Esto es A");
  });
})
