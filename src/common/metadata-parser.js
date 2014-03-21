var Parser = require('./parser');
var Utils = require('./utils');

exports.create = function($buffer) {
  var BufferStream;
  var bufferLength;

  if (Utils.isBrowser) {
    BufferStream = require("../browser/dom-bufferstream");
    bufferLength = $buffer.byteLength;
  }
  else {
    BufferStream = require("../node/bufferstream");
    bufferLength = $buffer.length;
  }

  return new Parser(new BufferStream($buffer, 0, bufferLength, true));
};
