[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

metadata-extract
========
metadata-extract is a library that allows the extraction of metadata from image files. It supports EXIF, IPTC and a subset of XMP. It is written in pure javascript and has no external dependencies. It works for both Node.js and the browser via Browserify.

It can also be used to get an image's size or EXIF thumbnail.

### Installing

    npm install metadata-extract

### Example

```
var metadata-extract = require('metadata-extract');
var parser = metadata-extract.create(buffer);
var result = parser.parse();
```
Depending on the platform you're using you would pass a Node.js buffer or a DOM ArrayBuffer.

Note that the buffer you pass does not have to be the buffer for the full jpeg file. The EXIF section of a jpeg file has a maximum size of 64 kb and when dealing with IPTC and XMP a safe value is 128 kb.

### Options

* ```parser.enableImageSize([boolean])``` - Reads the image size while parsing. Default: true.
* ```parser.enableSimpleValues([boolean])``` - Tries to cast metadata values as much as possible to the appropiate Javascript types. Default: true.

### Working with the result

#### Getting the metadata

The metadata will be stored in the tags, iptcTags and xmpTags objects.

#### Getting the image size

If ```parser.enableImageSize``` is set to true, ```result.getImageSize()``` will give you the image size as an object with width and height properties.

#### Getting the thumbnail

```result.hasThumbnail()``` will check if there is a thumbnail present. Exif supports thumbnails in jpeg and tiff format, though most are in jpeg format. You can check if there is a thumbnail present in a given format by passing the mime type: ```result.hasThumbnail("image/jpeg")```.

You can also get the image size of the thumbnail as an object with width and height properties: ```result.getThumbnailSize()```.

To get the Node.js buffer or DOM ArrayBuffer containing just the thumbnail call ```result.getThumbnailBuffer()```.

### Credits

* Developed by [Alexandru Badiu](http://alexandrubadiu.ro) at [Demotix.com](http://demotix.com).
* [Bruno Windel](https://github.com/bwindels)'s [exif-parser](https://github.com/bwindels/exif-parser) was a starting point.
