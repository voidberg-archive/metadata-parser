require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"metadata-parser":[function(require,module,exports){
module.exports=require('Oae6Hm');
},{}],"Oae6Hm":[function(require,module,exports){
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

},{"../browser/dom-bufferstream":3,"../node/bufferstream":4,"./parser":1,"./utils":2}],2:[function(require,module,exports){
(function(){/* global window: false */ 

function isBrowser() {
  return typeof(window) !== 'undefined';
}

exports.isBrowser = isBrowser();

exports.requireOrGlobal = function (module, global) {
  if (isBrowser()) {
    return window[global];
  }
  else {
    return require(module);
  }
};
})()
},{}],3:[function(require,module,exports){
(function(){/*global DataView, Uint8Array, ArrayBuffer, escape */

ArrayBuffer.prototype.slice = ArrayBuffer.prototype.slice || function (start, end) {
    start = start || 0;
    end = end || this.byteLength;
    if (end < 0) {
        end = this.byteLength + end;
      }
    if (start < 0) {
        start = this.byteLength + start;
      }
    if (start < 0) {
        start = 0;
      }
    if (end < 0) {
        end = 0;
      }
    if (end > this.byteLength) {
        end = this.byteLength;
      }
    if (start > end) {
        start = end;
      }

    var ret = new ArrayBuffer(end - start);
    var in1 = new Uint8Array(this, start, end - start);
    var out = new Uint8Array(ret);
    var i;

    for (i = 0; i < end - start; i++) {
        out[i] = in1[i];
      }

    return ret;
};

function DOMBufferStream(arrayBuffer, offset, length, bigEndian, parentOffset) {
	offset = offset || 0;
	length = length || (arrayBuffer.byteLength - offset);
	this.arrayBuffer = arrayBuffer.slice(offset, offset + length);
	this.view = new DataView(this.arrayBuffer, 0, this.arrayBuffer.byteLength);
	this.setBigEndian(bigEndian);
	this.offset = 0;
	this.parentOffset = (parentOffset || 0) + offset;
}

DOMBufferStream.prototype = {
	setBigEndian: function(bigEndian) {
		this.littleEndian = !bigEndian;
	},
	nextUInt8: function() {
		var value = this.view.getUint8(this.offset);
		this.offset += 1;
		return value;
	},
	nextInt8: function() {
		var value = this.view.getInt8(this.offset);
		this.offset += 1;
		return value;
	},
	nextUInt16: function() {
		var value = this.view.getUint16(this.offset, this.littleEndian);
		this.offset += 2;
		return value;
	},
	nextUInt32: function() {
		var value = this.view.getUint32(this.offset, this.littleEndian);
		this.offset += 4;
		return value;
	},
	nextInt16: function() {
		var value = this.view.getInt16(this.offset, this.littleEndian);
		this.offset += 2;
		return value;
	},
	nextInt32: function() {
		var value = this.view.getInt32(this.offset, this.littleEndian);
		this.offset += 4;
		return value;
	},
	nextFloat: function() {
		var value = this.view.getFloat32(this.offset, this.littleEndian);
		this.offset += 4;
		return value;
	},
	nextDouble: function() {
		var value = this.view.getFloat64(this.offset, this.littleEndian);
		this.offset += 8;
		return value;
	},
	nextBuffer: function(length) {
		//this won't work in IE10
		var value = this.arrayBuffer.slice(this.offset, this.offset + length);
		this.offset += length;
		return value;
	},
	remainingLength: function() {
    return this.arrayBuffer.byteLength - this.offset;
  },
  nextString: function(length) {
    var value = this.arrayBuffer.slice(this.offset, this.offset + length);
    var bytes = new Uint8Array(value);

    var encodedString = String.fromCharCode.apply(null, bytes);
    var result = '';
    try {
      result  = decodeURIComponent(escape(encodedString));
    }
    catch (err) {
    }

    // var len = bytes.length;
    // var result = "";

    // for (var i = 0; i < len; i++) {
    //   result = result + String.fromCharCode(bytes[i]);
    // }

		this.offset += length;
		return result;
	},
	mark: function() {
		var self = this;
		return {
			openWithOffset: function(offset) {
				offset = (offset || 0) + this.offset;
				return new DOMBufferStream(self.arrayBuffer, offset, self.arrayBuffer.byteLength - offset, !self.littleEndian, self.parentOffset);
			},
			offset: this.offset,
			getParentOffset: function() {
				return self.parentOffset;
			}
		};
	},
	offsetFrom: function(marker) {
		return this.parentOffset + this.offset - (marker.offset + marker.getParentOffset());
	},
	skip: function(amount) {
		this.offset += amount;
	},
	branch: function(offset, length) {
		length = typeof length === 'number' ? length : this.arrayBuffer.byteLength - (this.offset + offset);
		return new DOMBufferStream(this.arrayBuffer, this.offset + offset, length, !this.littleEndian, this.parentOffset);
	}
};

module.exports = DOMBufferStream;

})()
},{}],4:[function(require,module,exports){
function BufferStream(buffer, offset, length, bigEndian) {
	this.buffer = buffer;
	this.offset = offset || 0;
	length = typeof length === 'number' ? length : buffer.length;
	this.endPosition = this.offset + length;
	this.setBigEndian(bigEndian);
}

BufferStream.prototype = {
	setBigEndian: function(bigEndian) {
		this.bigEndian = !!bigEndian;
	},
	nextUInt8: function() {
		var value = this.buffer.readUInt8(this.offset);
		this.offset += 1;
		return value;
	},
	nextInt8: function() {
		var value = this.buffer.readInt8(this.offset);
		this.offset += 1;
		return value;
	},
	nextUInt16: function() {
		var value = this.bigEndian ? this.buffer.readUInt16BE(this.offset) : this.buffer.readUInt16LE(this.offset);
		this.offset += 2;
		return value;
	},
	nextUInt32: function() {
		var value = this.bigEndian ? this.buffer.readUInt32BE(this.offset) : this.buffer.readUInt32LE(this.offset);
		this.offset += 4;
		return value;
	},
	nextInt16: function() {
		var value = this.bigEndian ? this.buffer.readInt16BE(this.offset) : this.buffer.readInt16LE(this.offset);
		this.offset += 2;
		return value;
	},
	nextInt32: function() {
		var value = this.bigEndian ? this.buffer.readInt32BE(this.offset) : this.buffer.readInt32LE(this.offset);
		this.offset += 4;
		return value;
	},
	nextFloat: function() {
		var value = this.bigEndian ? this.buffer.readFloatBE(this.offset) : this.buffer.readFloatLE(this.offset);
		this.offset += 4;
		return value;
	},
	nextDouble: function() {
		var value = this.bigEndian ? this.buffer.readDoubleBE(this.offset) : this.buffer.readDoubleLE(this.offset);
		this.offset += 8;
		return value;
	},
	nextBuffer: function(length) {
		var value = this.buffer.slice(this.offset, this.offset + length);
		this.offset += length;
		return value;
	},
	remainingLength: function() {
		return this.endPosition - this.offset;
	},
	nextString: function(length) {
		var value = this.buffer.toString('utf8', this.offset, this.offset + length);
		this.offset += length;
		return value;
	},
	mark: function() {
		var self = this;
		return {
			openWithOffset: function(offset) {
				offset = (offset || 0) + this.offset;
				return new BufferStream(self.buffer, offset, self.endPosition - offset, self.bigEndian);
			},
			offset: this.offset
		};
	},
	offsetFrom: function(marker) {
		return this.offset - marker.offset;
	},
	skip: function(amount) {
		this.offset += amount;
	},
	branch: function(offset, length) {
		length = typeof length === 'number' ? length : this.endPosition - (this.offset + offset);
		return new BufferStream(this.buffer, this.offset + offset, length, this.bigEndian);
	}
};

module.exports = BufferStream;

},{}],1:[function(require,module,exports){
var jpeg = require('./jpeg');
var exif = require('./exif');
var iptc = require('./iptc');
var xmp = require('./xmp');
var simplify = require('./simplify');

function ExifResult(startMarker, tags, iptcTags, xmpTags, imageSize, thumbnailOffset, thumbnailLength, thumbnailType, app1Offset) {
	this.startMarker = startMarker;
	this.tags = tags;
	this.iptcTags = iptcTags;
	this.xmpTags = xmpTags;
	this.imageSize = imageSize;
	this.thumbnailOffset = thumbnailOffset;
	this.thumbnailLength = thumbnailLength;
	this.thumbnailType = thumbnailType;
	this.app1Offset = app1Offset;
}

ExifResult.prototype = {
	hasThumbnail: function(mime) {
		if(!this.thumbnailOffset || !this.thumbnailLength) {
			return false;
		}
		if(typeof mime !== 'string') {
			return true;
		}
		if(mime.toLowerCase().trim() === 'image/jpeg') {
			return this.thumbnailType === 6;
		}
		if(mime.toLowerCase().trim() === 'image/tiff') {
			return this.thumbnailType === 1;
		}
		return false;
	},
	getThumbnailOffset: function() {
		return this.app1Offset + 6 + this.thumbnailOffset;
	},
	getThumbnailLength: function() {
		return this.thumbnailLength;
	},
	getThumbnailBuffer: function() {
		return this._getThumbnailStream().nextBuffer(this.thumbnailLength);
	},
	_getThumbnailStream: function() {
		return this.startMarker.openWithOffset(this.getThumbnailOffset());
	},
	getImageSize: function() {
		return this.imageSize;
	},
	getThumbnailSize: function() {
		var stream = this._getThumbnailStream(), size;
		jpeg.parseSections(stream, function(sectionType, sectionStream) {
			if(jpeg.getSectionName(sectionType).name === 'SOF') {
				size = jpeg.getSizeFromSOFSection(sectionStream);
			}
		});
		return size;
	}
};

function Parser(stream) {
	this.stream = stream;
	this.flags = {
		readBinaryTags: false,
		resolveTagNames: true,
		simplifyValues: true,
		imageSize: true,
		hidePointers: true,
		returnTags: true
	};
}

Parser.prototype = {
	enableBinaryFields: function(enable) {
		this.flags.readBinaryTags = !!enable;
		return this;
	},
	enablePointers: function(enable) {
		this.flags.hidePointers = !enable;
		return this;
	},
	enableTagNames: function(enable) {
		this.flags.resolveTagNames = !!enable;
		return this;
	},
	enableImageSize: function(enable) {
		this.flags.imageSize = !!enable;
		return this;
	},
	enableReturnTags: function(enable) {
		this.flags.returnTags = !!enable;
		return this;
	},
	enableSimpleValues: function(enable) {
		this.flags.simplifyValues = !!enable;
		return this;
	},
	parse: function() {
		var start = this.stream.mark(),
			stream = start.openWithOffset(0),
			flags = this.flags,
			tags,
      iptcTags,
      xmpTags,
			imageSize,
			thumbnailOffset,
			thumbnailLength,
			thumbnailType,
			app1Offset,
			tagNames,
      iptcNames,
			getTagValue, setTagValue;

		if(flags.resolveTagNames) {
			tagNames = require('./exif-tags');
			iptcNames = require('./iptc-tags');

			tags = {};
      iptcTags = {};
      xmpTags = {};

			getTagValue = function(t) {
				return tags[t.name];
			};
			setTagValue = function(t, value) {
				tags[t.name] = value;
			};
		}
		else {
			tags = [];
      iptcTags = [];
      xmpTags = [];

			getTagValue = function(t) {
				var i;
				for(i = 0; i < tags.length; ++i) {
					if(tags[i].type === t.type && tags[i].section === t.section) {
						return tags.value;
					}
				}
			};
			setTagValue = function(t, value) {
				var i;
				for(i = 0; i < tags.length; ++i) {
					if(tags[i].type === t.type && tags[i].section === t.section) {
						tags.value = value;
						return;
					}
				}
			};
		}

    xmp.parseTags(stream, function(tagType, value) {
			if(flags.resolveTagNames) {
				xmpTags[tagType] = value;
			}
			else {
				xmpTags.push({
					type: tagType,
					value: value
				});
			}
    });

		jpeg.parseSections(stream, function(sectionType, sectionStream) {
			var validExifHeaders, validIptcHeaders, sectionOffset = sectionStream.offsetFrom(start);
      if(sectionType === 0xED) {
        validIptcHeaders = iptc.parseTags(sectionStream, function(tagType, value) {
          if(flags.resolveTagNames) {
            var name = iptcNames.iptc[tagType];
            if(name) {
              if (iptcTags[name]) {
                iptcTags[name] = [].concat(iptcTags[name]);
                iptcTags[name].push(value);
              }
              else {
                iptcTags[name] = value;
              }
						}
					}
					else {
						iptcTags.push({
							type: tagType,
							value: value
						});
					}
        });
      }

			if(sectionType === 0xE1) {
				validExifHeaders = exif.parseTags(sectionStream, function(ifdSection, tagType, value, format) {
					//ignore binary fields if disabled
					if(!flags.readBinaryTags && format === 7) {
						return;
					}

					if(tagType === 0x0201) {
						thumbnailOffset = value[0];
						if(flags.hidePointers) {return;}
					} else if(tagType === 0x0202) {
						thumbnailLength = value[0];
						if(flags.hidePointers) {return;}
					} else if(tagType === 0x0103) {
						thumbnailType = value[0];
						if(flags.hidePointers) {return;}
					}
					//if flag is set to not store tags, return here after storing pointers
					if(!flags.returnTags) {
						return;
					}

					if(flags.simplifyValues) {
						value = simplify.simplifyValue(value, format);
					}
					if(flags.resolveTagNames) {
						var sectionTagNames = ifdSection === exif.GPSIFD ? tagNames.gps : tagNames.exif;
						var name = sectionTagNames[tagType];
						if(!name) {
							name = tagNames.exif[tagType];
						}
						tags[name] = value;
					} else {
						tags.push({
							section: ifdSection,
							type: tagType,
							value: value
						});
					}
				});
				if(validExifHeaders) {
					app1Offset = sectionOffset;
				}
			}
			else if(flags.imageSize && jpeg.getSectionName(sectionType).name === 'SOF') {
				imageSize = jpeg.getSizeFromSOFSection(sectionStream);
			}
		});

		if(flags.simplifyValues) {
			simplify.castDegreeValues(getTagValue, setTagValue);
			simplify.castDateValues(getTagValue, setTagValue);
		}

		return new ExifResult(start, tags, iptcTags, xmpTags, imageSize, thumbnailOffset, thumbnailLength, thumbnailType, app1Offset);
	}
};

module.exports = Parser;

},{"./exif":6,"./exif-tags":10,"./iptc":7,"./iptc-tags":11,"./jpeg":5,"./simplify":9,"./xmp":8}],5:[function(require,module,exports){
module.exports = {
	parseSections: function(stream, iterator) {
		var len, markerType;
		stream.setBigEndian(true);
		//stop reading the stream at the SOS (Start of Stream) marker,
		//because its length is not stored in the header so we can't
		//know where to jump to. The only marker after that is just EOI (End Of Image) anyway
		while(stream.remainingLength() > 0 && markerType !== 0xDA) {
			if(stream.nextUInt8() !== 0xFF) {
				throw new Error('Invalid JPEG section offset');
			}
			markerType = stream.nextUInt8();
			//don't read size from markers that have no datas
			if((markerType >= 0xD0 && markerType <= 0xD9) || markerType === 0xDA) {
				len = 0;
			} else {
				len = stream.nextUInt16() - 2;
			}
			iterator(markerType, stream.branch(0, len));
			stream.skip(len);
		}
	},
	//stream should be located after SOF section size and in big endian mode, like passed to parseSections iterator
	getSizeFromSOFSection: function(stream) {
		stream.skip(1);
		return {
			height: stream.nextUInt16(),
			width: stream.nextUInt16()
		};
	},
	getSectionName: function(markerType) {
		var name, index;
		switch(markerType) {
			case 0xD8: name = 'SOI'; break;
			case 0xC4: name = 'DHT'; break;
			case 0xDB: name = 'DQT'; break;
			case 0xDD: name = 'DRI'; break;
			case 0xDA: name = 'SOS'; break;
			case 0xFE: name = 'COM'; break;
			case 0xD9: name = 'EOI'; break;
			default:
				if(markerType >= 0xE0 && markerType <= 0xEF) {
					name = 'APP';
					index = markerType - 0xE0;
				}
				else if(markerType >= 0xC0 && markerType <= 0xCF && markerType !== 0xC4 && markerType !== 0xC8 && markerType !== 0xCC) {
					name = 'SOF';
					index = markerType - 0xC0;
				}
				else if(markerType >= 0xD0 && markerType <= 0xD7) {
					name = 'RST';
					index = markerType - 0xD0;
				}
				break;
		}
		var nameStruct = {
			name: name
		};
		if(typeof index === 'number') {
			nameStruct.index = index;
		}
		return nameStruct;
	}
};
},{}],6:[function(require,module,exports){
function readExifValue(format, stream) {
	switch(format) {
		case 1: return stream.nextUInt8();
		case 3: return stream.nextUInt16();
		case 4: return stream.nextUInt32();
		case 5: return [stream.nextUInt32(), stream.nextUInt32()];
		case 6: return stream.nextInt8();
		case 8: return stream.nextUInt16();
		case 9: return stream.nextUInt32();
		case 10: return [stream.nextInt32(), stream.nextInt32()];
		case 11: return stream.nextFloat();
		case 12: return stream.nextDouble();
		default: throw new Error('Invalid format while decoding: ' + format);
	}
}

function getBytesPerComponent(format) {
	switch(format) {
		case 1:
		case 2:
		case 6:
		case 7:
			return 1;
		case 3:
		case 8:
			return 2;
		case 4:
		case 9:
		case 11:
			return 4;
		case 5:
		case 10:
		case 12:
			return 8;
		default:
			throw new Error('Invalid format: ' + format);
	}
}

function readExifTag(tiffMarker, stream) {
	var tagType = stream.nextUInt16(),
		format = stream.nextUInt16(),
		bytesPerComponent = getBytesPerComponent(format),
		components = stream.nextUInt32(),
		valueBytes = bytesPerComponent * components,
		values,
		c;

	/* if the value is bigger then 4 bytes, the value is in the data section of the IFD
	and the value present in the tag is the offset starting from the tiff header. So we replace the stream
	with a stream that is located at the given offset in the data section. s*/
	if(valueBytes > 4) {
		stream = tiffMarker.openWithOffset(stream.nextUInt32());
	}
	//we don't want to read strings as arrays
	if(format === 2) {
		values = stream.nextString(components);
		//cut off \0 characters
		var lastNull = values.indexOf('\0');
		if(lastNull !== -1) {
			values = values.substr(0, lastNull);
		}
	}
	else if(format === 7) {
		values = stream.nextBuffer(components);
	}
	else {
		values = [];
		for(c = 0; c < components; ++c) {
			values.push(readExifValue(format, stream));
		}
	}
	//since our stream is a stateful object, we need to skip remaining bytes
	//so our offset stays correct
	if(valueBytes < 4) {
		stream.skip(4 - valueBytes);
	}

	return [tagType, values, format];
}

function readIFDSection(tiffMarker, stream, iterator) {
	var numberOfEntries = stream.nextUInt16(), tag, i;
	for(i = 0; i < numberOfEntries; ++i) {
		tag = readExifTag(tiffMarker, stream);
		iterator(tag[0], tag[1], tag[2]);
	}
}

function readHeader(stream) {
	var exifHeader = stream.nextString(6);
	if(exifHeader !== 'Exif\0\0') {
		throw new Error('Invalid EXIF header');
	}

	var tiffMarker = stream.mark();
	var tiffHeader = stream.nextUInt16();
	if(tiffHeader === 0x4949) {
		stream.setBigEndian(false);
	} else if(tiffHeader === 0x4D4D) {
		stream.setBigEndian(true);
	} else {
		throw new Error('Invalid TIFF header');
	}
	if(stream.nextUInt16() !== 0x002A) {
		throw new Error('Invalid TIFF data');
	}
	return tiffMarker;
}

module.exports = {
	IFD0: 1,
	IFD1: 2,
	GPSIFD: 3,
	SubIFD: 4,
	InteropIFD: 5,

	parseTags: function(stream, iterator) {
    var module = this;
		var tiffMarker;
		try {
			tiffMarker = readHeader(stream);
		} catch(e) {
			return false;	//ignore APP1 sections with invalid headers
		}

		var subIfdOffset, gpsOffset, interopOffset;
		var ifd0Stream = tiffMarker.openWithOffset(stream.nextUInt32());
		readIFDSection(tiffMarker, ifd0Stream, function(tagType, value, format) {
			switch(tagType) {
				case 34853: gpsOffset = value[0]; break;
				case 34665: subIfdOffset = value[0]; break;
				default: iterator(module.IFD0, tagType, value, format); break;
			}
		});

		var ifd1Offset = ifd0Stream.nextUInt32();
		if(ifd1Offset !== 0) {
      var ifd1Stream = tiffMarker.openWithOffset(ifd1Offset);
      readIFDSection(tiffMarker, ifd1Stream, function(tagType, value, format) {
        iterator(module.IFD1, tagType, value, format);
      });
		}

		if(gpsOffset) {
			var gpsStream = tiffMarker.openWithOffset(gpsOffset);
      readIFDSection(tiffMarker, gpsStream, function(tagType, value, format) {
        iterator(module.GPSIFD, tagType, value, format);
      });
		}

		if(subIfdOffset) {
			var subIfdStream = tiffMarker.openWithOffset(subIfdOffset);
			readIFDSection(tiffMarker, subIfdStream, function(tagType, value, format) {
				if(tagType === 0xA005) {
					interopOffset = value[0];
				} else {
					iterator(module.InteropIFD, tagType, value, format);
				}
			});
		}

		if(interopOffset) {
			var interopStream = tiffMarker.openWithOffset(interopOffset);
			readIFDSection(tiffMarker, interopStream, function(tagType, value, format) {
        iterator(module.InteropIFD, tagType, value, format);
      });
		}

		return true;
	}
};

},{}],7:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
module.exports = {
	exif : {
		0x0001 : "InteropIndex",
		0x0002 : "InteropVersion",
		0x000B : "ProcessingSoftware",
		0x00FE : "SubfileType",
		0x00FF : "OldSubfileType",
		0x0100 : "ImageWidth",
		0x0101 : "ImageHeight",
		0x0102 : "BitsPerSample",
		0x0103 : "Compression",
		0x0106 : "PhotometricInterpretation",
		0x0107 : "Thresholding",
		0x0108 : "CellWidth",
		0x0109 : "CellLength",
		0x010A : "FillOrder",
		0x010D : "DocumentName",
		0x010E : "ImageDescription",
		0x010F : "Make",
		0x0110 : "Model",
		0x0111 : "StripOffsets",
		0x0112 : "Orientation",
		0x0115 : "SamplesPerPixel",
		0x0116 : "RowsPerStrip",
		0x0117 : "StripByteCounts",
		0x0118 : "MinSampleValue",
		0x0119 : "MaxSampleValue",
		0x011A : "XResolution",
		0x011B : "YResolution",
		0x011C : "PlanarConfiguration",
		0x011D : "PageName",
		0x011E : "XPosition",
		0x011F : "YPosition",
		0x0120 : "FreeOffsets",
		0x0121 : "FreeByteCounts",
		0x0122 : "GrayResponseUnit",
		0x0123 : "GrayResponseCurve",
		0x0124 : "T4Options",
		0x0125 : "T6Options",
		0x0128 : "ResolutionUnit",
		0x0129 : "PageNumber",
		0x012C : "ColorResponseUnit",
		0x012D : "TransferFunction",
		0x0131 : "Software",
		0x0132 : "ModifyDate",
		0x013B : "Artist",
		0x013C : "HostComputer",
		0x013D : "Predictor",
		0x013E : "WhitePoint",
		0x013F : "PrimaryChromaticities",
		0x0140 : "ColorMap",
		0x0141 : "HalftoneHints",
		0x0142 : "TileWidth",
		0x0143 : "TileLength",
		0x0144 : "TileOffsets",
		0x0145 : "TileByteCounts",
		0x0146 : "BadFaxLines",
		0x0147 : "CleanFaxData",
		0x0148 : "ConsecutiveBadFaxLines",
		0x014A : "SubIFD",
		0x014C : "InkSet",
		0x014D : "InkNames",
		0x014E : "NumberofInks",
		0x0150 : "DotRange",
		0x0151 : "TargetPrinter",
		0x0152 : "ExtraSamples",
		0x0153 : "SampleFormat",
		0x0154 : "SMinSampleValue",
		0x0155 : "SMaxSampleValue",
		0x0156 : "TransferRange",
		0x0157 : "ClipPath",
		0x0158 : "XClipPathUnits",
		0x0159 : "YClipPathUnits",
		0x015A : "Indexed",
		0x015B : "JPEGTables",
		0x015F : "OPIProxy",
		0x0190 : "GlobalParametersIFD",
		0x0191 : "ProfileType",
		0x0192 : "FaxProfile",
		0x0193 : "CodingMethods",
		0x0194 : "VersionYear",
		0x0195 : "ModeNumber",
		0x01B1 : "Decode",
		0x01B2 : "DefaultImageColor",
		0x01B3 : "T82Options",
		0x01B5 : "JPEGTables",
		0x0200 : "JPEGProc",
		0x0201 : "ThumbnailOffset",
		0x0202 : "ThumbnailLength",
		0x0203 : "JPEGRestartInterval",
		0x0205 : "JPEGLosslessPredictors",
		0x0206 : "JPEGPointTransforms",
		0x0207 : "JPEGQTables",
		0x0208 : "JPEGDCTables",
		0x0209 : "JPEGACTables",
		0x0211 : "YCbCrCoefficients",
		0x0212 : "YCbCrSubSampling",
		0x0213 : "YCbCrPositioning",
		0x0214 : "ReferenceBlackWhite",
		0x022F : "StripRowCounts",
		0x02BC : "ApplicationNotes",
		0x03E7 : "USPTOMiscellaneous",
		0x1000 : "RelatedImageFileFormat",
		0x1001 : "RelatedImageWidth",
		0x1002 : "RelatedImageHeight",
		0x4746 : "Rating",
		0x4747 : "XP_DIP_XML",
		0x4748 : "StitchInfo",
		0x4749 : "RatingPercent",
		0x800D : "ImageID",
		0x80A3 : "WangTag1",
		0x80A4 : "WangAnnotation",
		0x80A5 : "WangTag3",
		0x80A6 : "WangTag4",
		0x80E3 : "Matteing",
		0x80E4 : "DataType",
		0x80E5 : "ImageDepth",
		0x80E6 : "TileDepth",
		0x827D : "Model2",
		0x828D : "CFARepeatPatternDim",
		0x828E : "CFAPattern2",
		0x828F : "BatteryLevel",
		0x8290 : "KodakIFD",
		0x8298 : "Copyright",
		0x829A : "ExposureTime",
		0x829D : "FNumber",
		0x82A5 : "MDFileTag",
		0x82A6 : "MDScalePixel",
		0x82A7 : "MDColorTable",
		0x82A8 : "MDLabName",
		0x82A9 : "MDSampleInfo",
		0x82AA : "MDPrepDate",
		0x82AB : "MDPrepTime",
		0x82AC : "MDFileUnits",
		0x830E : "PixelScale",
		0x8335 : "AdventScale",
		0x8336 : "AdventRevision",
		0x835C : "UIC1Tag",
		0x835D : "UIC2Tag",
		0x835E : "UIC3Tag",
		0x835F : "UIC4Tag",
		0x83BB : "IPTC-NAA",
		0x847E : "IntergraphPacketData",
		0x847F : "IntergraphFlagRegisters",
		0x8480 : "IntergraphMatrix",
		0x8481 : "INGRReserved",
		0x8482 : "ModelTiePoint",
		0x84E0 : "Site",
		0x84E1 : "ColorSequence",
		0x84E2 : "IT8Header",
		0x84E3 : "RasterPadding",
		0x84E4 : "BitsPerRunLength",
		0x84E5 : "BitsPerExtendedRunLength",
		0x84E6 : "ColorTable",
		0x84E7 : "ImageColorIndicator",
		0x84E8 : "BackgroundColorIndicator",
		0x84E9 : "ImageColorValue",
		0x84EA : "BackgroundColorValue",
		0x84EB : "PixelIntensityRange",
		0x84EC : "TransparencyIndicator",
		0x84ED : "ColorCharacterization",
		0x84EE : "HCUsage",
		0x84EF : "TrapIndicator",
		0x84F0 : "CMYKEquivalent",
		0x8546 : "SEMInfo",
		0x8568 : "AFCP_IPTC",
		0x85B8 : "PixelMagicJBIGOptions",
		0x85D8 : "ModelTransform",
		0x8602 : "WB_GRGBLevels",
		0x8606 : "LeafData",
		0x8649 : "PhotoshopSettings",
		0x8769 : "ExifOffset",
		0x8773 : "ICC_Profile",
		0x877F : "TIFF_FXExtensions",
		0x8780 : "MultiProfiles",
		0x8781 : "SharedData",
		0x8782 : "T88Options",
		0x87AC : "ImageLayer",
		0x87AF : "GeoTiffDirectory",
		0x87B0 : "GeoTiffDoubleParams",
		0x87B1 : "GeoTiffAsciiParams",
		0x8822 : "ExposureProgram",
		0x8824 : "SpectralSensitivity",
		0x8825 : "GPSInfo",
		0x8827 : "ISO",
		0x8828 : "Opto-ElectricConvFactor",
		0x8829 : "Interlace",
		0x882A : "TimeZoneOffset",
		0x882B : "SelfTimerMode",
		0x8830 : "SensitivityType",
		0x8831 : "StandardOutputSensitivity",
		0x8832 : "RecommendedExposureIndex",
		0x8833 : "ISOSpeed",
		0x8834 : "ISOSpeedLatitudeyyy",
		0x8835 : "ISOSpeedLatitudezzz",
		0x885C : "FaxRecvParams",
		0x885D : "FaxSubAddress",
		0x885E : "FaxRecvTime",
		0x888A : "LeafSubIFD",
		0x9000 : "ExifVersion",
		0x9003 : "DateTimeOriginal",
		0x9004 : "CreateDate",
		0x9101 : "ComponentsConfiguration",
		0x9102 : "CompressedBitsPerPixel",
		0x9201 : "ShutterSpeedValue",
		0x9202 : "ApertureValue",
		0x9203 : "BrightnessValue",
		0x9204 : "ExposureCompensation",
		0x9205 : "MaxApertureValue",
		0x9206 : "SubjectDistance",
		0x9207 : "MeteringMode",
		0x9208 : "LightSource",
		0x9209 : "Flash",
		0x920A : "FocalLength",
		0x920B : "FlashEnergy",
		0x920C : "SpatialFrequencyResponse",
		0x920D : "Noise",
		0x920E : "FocalPlaneXResolution",
		0x920F : "FocalPlaneYResolution",
		0x9210 : "FocalPlaneResolutionUnit",
		0x9211 : "ImageNumber",
		0x9212 : "SecurityClassification",
		0x9213 : "ImageHistory",
		0x9214 : "SubjectArea",
		0x9215 : "ExposureIndex",
		0x9216 : "TIFF-EPStandardID",
		0x9217 : "SensingMethod",
		0x923A : "CIP3DataFile",
		0x923B : "CIP3Sheet",
		0x923C : "CIP3Side",
		0x923F : "StoNits",
		0x927C : "MakerNote",
		0x9286 : "UserComment",
		0x9290 : "SubSecTime",
		0x9291 : "SubSecTimeOriginal",
		0x9292 : "SubSecTimeDigitized",
		0x932F : "MSDocumentText",
		0x9330 : "MSPropertySetStorage",
		0x9331 : "MSDocumentTextPosition",
		0x935C : "ImageSourceData",
		0x9C9B : "XPTitle",
		0x9C9C : "XPComment",
		0x9C9D : "XPAuthor",
		0x9C9E : "XPKeywords",
		0x9C9F : "XPSubject",
		0xA000 : "FlashpixVersion",
		0xA001 : "ColorSpace",
		0xA002 : "ExifImageWidth",
		0xA003 : "ExifImageHeight",
		0xA004 : "RelatedSoundFile",
		0xA005 : "InteropOffset",
		0xA20B : "FlashEnergy",
		0xA20C : "SpatialFrequencyResponse",
		0xA20D : "Noise",
		0xA20E : "FocalPlaneXResolution",
		0xA20F : "FocalPlaneYResolution",
		0xA210 : "FocalPlaneResolutionUnit",
		0xA211 : "ImageNumber",
		0xA212 : "SecurityClassification",
		0xA213 : "ImageHistory",
		0xA214 : "SubjectLocation",
		0xA215 : "ExposureIndex",
		0xA216 : "TIFF-EPStandardID",
		0xA217 : "SensingMethod",
		0xA300 : "FileSource",
		0xA301 : "SceneType",
		0xA302 : "CFAPattern",
		0xA401 : "CustomRendered",
		0xA402 : "ExposureMode",
		0xA403 : "WhiteBalance",
		0xA404 : "DigitalZoomRatio",
		0xA405 : "FocalLengthIn35mmFormat",
		0xA406 : "SceneCaptureType",
		0xA407 : "GainControl",
		0xA408 : "Contrast",
		0xA409 : "Saturation",
		0xA40A : "Sharpness",
		0xA40B : "DeviceSettingDescription",
		0xA40C : "SubjectDistanceRange",
		0xA420 : "ImageUniqueID",
		0xA430 : "OwnerName",
		0xA431 : "SerialNumber",
		0xA432 : "LensInfo",
		0xA433 : "LensMake",
		0xA434 : "LensModel",
		0xA435 : "LensSerialNumber",
		0xA480 : "GDALMetadata",
		0xA481 : "GDALNoData",
		0xA500 : "Gamma",
		0xAFC0 : "ExpandSoftware",
		0xAFC1 : "ExpandLens",
		0xAFC2 : "ExpandFilm",
		0xAFC3 : "ExpandFilterLens",
		0xAFC4 : "ExpandScanner",
		0xAFC5 : "ExpandFlashLamp",
		0xBC01 : "PixelFormat",
		0xBC02 : "Transformation",
		0xBC03 : "Uncompressed",
		0xBC04 : "ImageType",
		0xBC80 : "ImageWidth",
		0xBC81 : "ImageHeight",
		0xBC82 : "WidthResolution",
		0xBC83 : "HeightResolution",
		0xBCC0 : "ImageOffset",
		0xBCC1 : "ImageByteCount",
		0xBCC2 : "AlphaOffset",
		0xBCC3 : "AlphaByteCount",
		0xBCC4 : "ImageDataDiscard",
		0xBCC5 : "AlphaDataDiscard",
		0xC427 : "OceScanjobDesc",
		0xC428 : "OceApplicationSelector",
		0xC429 : "OceIDNumber",
		0xC42A : "OceImageLogic",
		0xC44F : "Annotations",
		0xC4A5 : "PrintIM",
		0xC580 : "USPTOOriginalContentType",
		0xC612 : "DNGVersion",
		0xC613 : "DNGBackwardVersion",
		0xC614 : "UniqueCameraModel",
		0xC615 : "LocalizedCameraModel",
		0xC616 : "CFAPlaneColor",
		0xC617 : "CFALayout",
		0xC618 : "LinearizationTable",
		0xC619 : "BlackLevelRepeatDim",
		0xC61A : "BlackLevel",
		0xC61B : "BlackLevelDeltaH",
		0xC61C : "BlackLevelDeltaV",
		0xC61D : "WhiteLevel",
		0xC61E : "DefaultScale",
		0xC61F : "DefaultCropOrigin",
		0xC620 : "DefaultCropSize",
		0xC621 : "ColorMatrix1",
		0xC622 : "ColorMatrix2",
		0xC623 : "CameraCalibration1",
		0xC624 : "CameraCalibration2",
		0xC625 : "ReductionMatrix1",
		0xC626 : "ReductionMatrix2",
		0xC627 : "AnalogBalance",
		0xC628 : "AsShotNeutral",
		0xC629 : "AsShotWhiteXY",
		0xC62A : "BaselineExposure",
		0xC62B : "BaselineNoise",
		0xC62C : "BaselineSharpness",
		0xC62D : "BayerGreenSplit",
		0xC62E : "LinearResponseLimit",
		0xC62F : "CameraSerialNumber",
		0xC630 : "DNGLensInfo",
		0xC631 : "ChromaBlurRadius",
		0xC632 : "AntiAliasStrength",
		0xC633 : "ShadowScale",
		0xC634 : "DNGPrivateData",
		0xC635 : "MakerNoteSafety",
		0xC640 : "RawImageSegmentation",
		0xC65A : "CalibrationIlluminant1",
		0xC65B : "CalibrationIlluminant2",
		0xC65C : "BestQualityScale",
		0xC65D : "RawDataUniqueID",
		0xC660 : "AliasLayerMetadata",
		0xC68B : "OriginalRawFileName",
		0xC68C : "OriginalRawFileData",
		0xC68D : "ActiveArea",
		0xC68E : "MaskedAreas",
		0xC68F : "AsShotICCProfile",
		0xC690 : "AsShotPreProfileMatrix",
		0xC691 : "CurrentICCProfile",
		0xC692 : "CurrentPreProfileMatrix",
		0xC6BF : "ColorimetricReference",
		0xC6D2 : "PanasonicTitle",
		0xC6D3 : "PanasonicTitle2",
		0xC6F3 : "CameraCalibrationSig",
		0xC6F4 : "ProfileCalibrationSig",
		0xC6F5 : "ProfileIFD",
		0xC6F6 : "AsShotProfileName",
		0xC6F7 : "NoiseReductionApplied",
		0xC6F8 : "ProfileName",
		0xC6F9 : "ProfileHueSatMapDims",
		0xC6FA : "ProfileHueSatMapData1",
		0xC6FB : "ProfileHueSatMapData2",
		0xC6FC : "ProfileToneCurve",
		0xC6FD : "ProfileEmbedPolicy",
		0xC6FE : "ProfileCopyright",
		0xC714 : "ForwardMatrix1",
		0xC715 : "ForwardMatrix2",
		0xC716 : "PreviewApplicationName",
		0xC717 : "PreviewApplicationVersion",
		0xC718 : "PreviewSettingsName",
		0xC719 : "PreviewSettingsDigest",
		0xC71A : "PreviewColorSpace",
		0xC71B : "PreviewDateTime",
		0xC71C : "RawImageDigest",
		0xC71D : "OriginalRawFileDigest",
		0xC71E : "SubTileBlockSize",
		0xC71F : "RowInterleaveFactor",
		0xC725 : "ProfileLookTableDims",
		0xC726 : "ProfileLookTableData",
		0xC740 : "OpcodeList1",
		0xC741 : "OpcodeList2",
		0xC74E : "OpcodeList3",
		0xC761 : "NoiseProfile",
		0xC763 : "TimeCodes",
		0xC764 : "FrameRate",
		0xC772 : "TStop",
		0xC789 : "ReelName",
		0xC791 : "OriginalDefaultFinalSize",
		0xC792 : "OriginalBestQualitySize",
		0xC793 : "OriginalDefaultCropSize",
		0xC7A1 : "CameraLabel",
		0xC7A3 : "ProfileHueSatMapEncoding",
		0xC7A4 : "ProfileLookTableEncoding",
		0xC7A5 : "BaselineExposureOffset",
		0xC7A6 : "DefaultBlackRender",
		0xC7A7 : "NewRawImageDigest",
		0xC7A8 : "RawToPreviewGain",
		0xC7B5 : "DefaultUserCrop",
		0xEA1C : "Padding",
		0xEA1D : "OffsetSchema",
		0xFDE8 : "OwnerName",
		0xFDE9 : "SerialNumber",
		0xFDEA : "Lens",
		0xFE00 : "KDC_IFD",
		0xFE4C : "RawFile",
		0xFE4D : "Converter",
		0xFE4E : "WhiteBalance",
		0xFE51 : "Exposure",
		0xFE52 : "Shadows",
		0xFE53 : "Brightness",
		0xFE54 : "Contrast",
		0xFE55 : "Saturation",
		0xFE56 : "Sharpness",
		0xFE57 : "Smoothness",
		0xFE58 : "MoireFilter"
		
	},
	gps : {	
		0x0000 : 'GPSVersionID',
		0x0001 : 'GPSLatitudeRef',
		0x0002 : 'GPSLatitude',
		0x0003 : 'GPSLongitudeRef',
		0x0004 : 'GPSLongitude',
		0x0005 : 'GPSAltitudeRef',
		0x0006 : 'GPSAltitude',
		0x0007 : 'GPSTimeStamp',
		0x0008 : 'GPSSatellites',
		0x0009 : 'GPSStatus',
		0x000A : 'GPSMeasureMode',
		0x000B : 'GPSDOP',
		0x000C : 'GPSSpeedRef',
		0x000D : 'GPSSpeed',
		0x000E : 'GPSTrackRef',
		0x000F : 'GPSTrack',
		0x0010 : 'GPSImgDirectionRef',
		0x0011 : 'GPSImgDirection',
		0x0012 : 'GPSMapDatum',
		0x0013 : 'GPSDestLatitudeRef',
		0x0014 : 'GPSDestLatitude',
		0x0015 : 'GPSDestLongitudeRef',
		0x0016 : 'GPSDestLongitude',
		0x0017 : 'GPSDestBearingRef',
		0x0018 : 'GPSDestBearing',
		0x0019 : 'GPSDestDistanceRef',
		0x001A : 'GPSDestDistance',
		0x001B : 'GPSProcessingMethod',
		0x001C : 'GPSAreaInformation',
		0x001D : 'GPSDateStamp',
		0x001E : 'GPSDifferential',
		0x001F : 'GPSHPositioningError'
	}
};
},{}],11:[function(require,module,exports){
module.exports = {
	iptc : {
		0x50 : "By-line",
		0x55 : "By-line Title",
		0x6E : "Credits",
		0x73 : "Source",
		0x05 : "Object Name",
		0x37 : "Date Created",
		0x5A : "City",
		0x5F : "State",
		0x65 : "Country",
		0x67 : "Original Transmission Reference",
		0x74 : "Copyright",
		0x78 : "Caption",
		0x7A : "Caption Writer",
		0x69 : "Headline",
		0x28 : "Special Instructions",
		0x0F : "Category",
		0x14 : "Supplemental Categories",
		0x19 : "Keywords"
	}
};
},{}],8:[function(require,module,exports){
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

},{"./xmp-tags":12}],9:[function(require,module,exports){
var exif = require('./exif');

var degreeTags = [{
	section: exif.GPSIFD,
	type: 0x0002,
	name: 'GPSLatitude',
	refType: 0x0001,
	refName: 'GPSLatitudeRef',
	posVal: 'N'
},
{
	section: exif.GPSIFD,
	type: 0x0004,
	name: 'GPSLongitude',
	refType: 0x0003,
	refName: 'GPSLongitudeRef',
	posVal: 'E'
}];
var dateTags = [{
	section: exif.SubIFD,
	type: 0x9003,
	name: 'DateTimeOriginal'
},
{
	section: exif.SubIFD,
	type: 0x9004,
	name: 'CreateDate'
}];

module.exports = {
	castDegreeValues: function(getTagValue, setTagValue) {
		degreeTags.forEach(function(t) {
			var degreeVal = getTagValue(t);
			if(degreeVal) {
				var degreeRef = getTagValue({section: t.section, type: t.refType, name: t.refName});
				var degreeNumRef = degreeRef === t.posVal ? 1 : -1;
				var degree = (degreeVal[0] + (degreeVal[1] / 60) + (degreeVal[2] / 3600)) * degreeNumRef;
				setTagValue(t, degree);
			}
		});
	},
	castDateValues: function(getTagValue, setTagValue) {
		dateTags.forEach(function(t) {
			var dateStrVal = getTagValue(t);
			if(dateStrVal) {
				var parts = dateStrVal.split(' '),
					dateParts = parts[0].split(':'),
					timeParts = parts[1].split(':');
				var date = new Date();
				date.setUTCFullYear(dateParts[0]);
				date.setUTCMonth(dateParts[1] - 1);
				date.setUTCDate(dateParts[2]);
				date.setUTCHours(timeParts[0]);
				date.setUTCMinutes(timeParts[1]);
				date.setUTCSeconds(timeParts[2]);
				date.setUTCMilliseconds(0);
				var timestamp = date.getTime() / 1000;
				setTagValue(t, timestamp);
			}
		});
	},
	simplifyValue: function(values, format) {
		if(Array.isArray(values)) {
			values = values.map(function(value) {
				if(format === 10 || format === 5) {
					return value[0] / value[1];
				}
				return value;
			});
			if(values.length === 1) {
				values = values[0];
			}
		}
		return values;
	}
};
},{"./exif":6}],12:[function(require,module,exports){
module.exports = {
  xmp: {
    'Creator Email'     : { 'regexp': '<Iptc4xmpCore:CreatorContactInfo[^>]+?CiEmailWork="([^"]*)"', 'match': 1, 'split': '' },
    'Owner Name'        : { 'regexp': '<rdf:Description[^>]+?aux:OwnerName="([^"]*)"', 'match': 1, 'split': '' },
    'Creation Date'     : { 'regexp': '<rdf:Description[^>]+?xmp:CreateDate="([^"]*)"', 'match': 1, 'split': '' },
    'Modification Date' : { 'regexp': '<rdf:Description[^>]+?xmp:ModifyDate="([^"]*)"', 'match': 1, 'split': '' },
    'Label'             : { 'regexp': '<rdf:Description[^>]+?xmp:Label="([^"]*)"', 'match': 1, 'split': '' },
    'Credit'            : { 'regexp': '<rdf:Description[^>]+?photoshop:Credit="([^"]*)"', 'match': 1, 'split': '' },
    'Source'            : { 'regexp': '<rdf:Description[^>]+?photoshop:Source="([^"]*)"', 'match': 1, 'split': '' },
    'Headline'          : { 'regexp': '<rdf:Description[^>]+?photoshop:Headline="([^"]*)"', 'match': 1, 'split': '' },
    'City'              : { 'regexp': '<rdf:Description[^>]+?photoshop:City="([^"]*)"', 'match': 1, 'split': '' },
    'State'             : { 'regexp': '<rdf:Description[^>]+?photoshop:State="([^"]*)"', 'match': 1, 'split': '' },
    'Country'           : { 'regexp': '<rdf:Description[^>]+?photoshop:Country="([^"]*)"', 'match': 1, 'split': '' },
    'Country Code'      : { 'regexp': '<rdf:Description[^>]+?Iptc4xmpCore:CountryCode="([^"]*)"', 'match': 1, 'split': '' },
    'Location'          : { 'regexp': '<rdf:Description[^>]+?Iptc4xmpCore:Location="([^"]*)"', 'match': 1, 'split': '' },
    'Title'             : { 'regexp': '<dc:title>\\s*<rdf:Alt>\\s*(.*?)\\s*<\/rdf:Alt>\\s*<\/dc:title>', 'match': 1, 'split': '' },
    'Description'       : { 'regexp': '<dc:description>\\s*<rdf:Alt>\\s*<rdf:li(.+?)>(.*?)</rdf:li>\\s*<\/rdf:Alt>\\s*<\/dc:description>', 'match': 2, 'split': '' },
    'Creator'           : { 'regexp': '<dc:creator>\\s*<rdf:Seq>\\s*<rdf:li>(.*?)</rdf:li>\\s*<\/rdf:Seq>\\s*<\/dc:creator>', 'match': 1, 'split': '' },
    'Keywords'          : { 'regexp': '<dc:subject>\\s*<rdf:Bag>\\s*<rdf:li>(.*?)</rdf:li>\\s*<\/rdf:Bag>\\s*<\/dc:subject>', 'match': 1, 'split': '</rdf:li><rdf:li>' },
  }
};

},{}]},{},["Oae6Hm"])
;