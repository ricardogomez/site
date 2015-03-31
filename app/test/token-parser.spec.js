var parse = require('../lib/token-parser');

describe("Parser", function() {
  it("cmd has method", function() {
    var cmd = parse("metodo");
    expect(cmd.method).toEqual("metodo");
  });
  it("cmd has value", function() {
    var cmd = parse("método Value");
    expect(cmd.value()).toEqual('Value');
  });
  it("value can have quotes", function() {
    var cmd = parse('método "This is awe"');
    expect(cmd.value()).toEqual("This is awe");
  })

  it("cmd has options", function() {
    var cmd = parse('met val number: 1');
    expect(cmd.option('number')).toEqual('1');
  });

  it("options can have alias", function() {
    var cmd = parse('met val num: 2');
    expect(cmd.option('number', 'num')).toEqual('2');
  });

});
