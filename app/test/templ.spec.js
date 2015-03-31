
var templ = require('../lib/templ');

describe('Templ', function() {
  it("replaces strings", function() {
    var ctx = function(e) { return e.toUpperCase(); }
    expect(templ("Esto es {{a}}", ctx)).toEqual("Esto es A");
  });

  it("create helpers", function() {
    var ctx = templ.helpers({
      "one": function() { return 1; },
      "two": function() { return 2; }
    });

    expect(templ("{{One}} {{Two}}", ctx)).toEqual("1 2");
  });

  describe('Helper functions', function() {
    it("helper function has a value", function() {
      var ctx = templ.helpers({
        "one": function(cmd) { return cmd.value(); }
      });
      expect(templ("{{ one   Value }}", ctx)).toEqual('Value');
    });
    it("options can have quotes", function() {
      var ctx = templ.helpers({
        "print": function(cmd) { return cmd.value(); }
      });
      expect(templ('{{ print "This is awe" }}', ctx)).toEqual("This is awe");
    })

    it("helper cmd has options", function() {
      var ctx = templ.helpers({
        "play": function(cmd) { return cmd.options('number'); }
      });
      expect(templ("{{ play one number: 1 }}", ctx)).toEqual('1');
    });

    it("helper cmd options can have alias", function() {
      var ctx = templ.helpers({
        "play": function(cmd) { return cmd.options('number', 'num'); }
      });
      expect(templ("{{ play one num: 1 }}", ctx)).toEqual('1');
    });
  });
})
