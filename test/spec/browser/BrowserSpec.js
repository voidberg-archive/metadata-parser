/*global XMLHttpRequest, runs, waitsFor */

'use strict';

var MetadataParser = require('metadata-parser');

describe("ParserTest", function() {
  it("should parse the frog file correctly", function() {
    var loaded = false;
    var response;
    var results = {};

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:18081/poison_dart_frog.jpg', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (this.status === 200) {
        response = this.response;
      }
      else {
        response = null;
      }
      loaded = true;
    };

    xhr.send();

    waitsFor(function() {
      return loaded !== false;
    });

    return runs(function() {
      if (response) {
        var p = MetadataParser.create(response);
        results = p.parse();
      }

      return expect(results.app1Offset).toEqual(22);
      // return expect(results.tags.length).not.toEqual(0);
    });
  });
});
