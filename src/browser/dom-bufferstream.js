/*global DataView, Uint8Array, ArrayBuffer, escape */

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
