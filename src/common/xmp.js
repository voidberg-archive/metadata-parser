var tags = require('./xmp-tags');

module.exports = {
  parseTags: function(ostream, iterator) {
    ostream.setBigEndian(true);

    var chunkSize = 12;
    var startTag = '<x:xmpmeta';
    var endTag = '</x:xmpmeta>';
    var buffer;
    var hasXmp = false;
    var chunk;

    var stream = ostream.branch(0);

    while(stream.remainingLength() > 0) {
      chunk = stream.nextString(chunkSize);
      buffer = buffer + chunk;

      var startPosition = buffer.indexOf(startTag);
      var endPosition = buffer.indexOf(endTag);

      if (startPosition !== -1 && endPosition !== -1) {
        buffer = buffer.substr(startPosition, endPosition - startPosition + 12);
        hasXmp = true;
        break;
      }
      else if (startPosition !== -1) {
        buffer = buffer.substr(startPosition);
        hasXmp = true;
      }
      else if (buffer.length > startTag.length * 2) {
        buffer = buffer.substr(startTag.length);
      }
    }

    if (hasXmp) {
      buffer = buffer.replace(/\n/g, '').
        replace(/[\t ]+</g, '<').
        replace(/\>[\t ]+</g, '><').
        replace(/\>[\t ]+$/g, '>');

      for(var label in tags.xmp) {
        var data = tags.xmp[label];

        var matches = buffer.match(data.regexp);
        if (matches) {
          if (matches[data.match]) {
            var result = matches[data.match];
            if (data.split !== '') {
              result = result.split(data.split);
            }
            iterator(label, result);
          }
        }
      }
    }
  }
};
