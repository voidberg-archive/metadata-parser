/*jshint -W044 */

function read8BIMSection(iptcMarker, iterator) {
  var pos = 0;
  var stream = iptcMarker.openWithOffset(0);

  while (stream.remainingLength() > 0) {
    var marker = stream.nextString(4);

    if (marker === '8BIM') {
      var type = stream.nextString(2);
      if (type === '\4\4') {
        var hi = stream.nextInt8();
        if (hi === 0) {
          stream.skip(3);
        }
        else {
          stream.skip(hi + 2);
        }

        var sl = stream.nextInt16();
        var ipos = 0;

        while (ipos < sl) {
          try {
            stream.nextString(2);
            var ttype = stream.nextInt8();
            var tlen = stream.nextInt16();
            var tvalue = stream.nextString(tlen);

            iterator(ttype, tvalue);

            ipos += 2 + 3 + tlen;
          }
          catch (e) {
            ipos += 2 + 3;
          }
        }
      }
    }
    pos += 4;
  }
}

function readHeader(stream) {
  var iptcHeader = stream.nextString(14);
	if(iptcHeader !== 'Photoshop 3.0\0') {
		throw new Error('Invalid IPTC header');
	}

	var iptcMarker = stream.mark();
  return iptcMarker;
}

module.exports = {
	parseTags: function(stream, iterator) {
		var iptcMarker;
		try {
			iptcMarker = readHeader(stream);
		} catch(e) {
			return false;	//ignore APP13 sections with invalid headers
		}

    read8BIMSection(iptcMarker, iterator);

    return true;
	}
};
