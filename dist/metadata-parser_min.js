require=function(a,b,c){function d(c,f){if(!b[c]){if(!a[c]){var g="function"==typeof require&&require;if(!f&&g)return g(c,!0);if(e)return e(c,!0);throw new Error("Cannot find module '"+c+"'")}var h=b[c]={exports:{}};a[c][0].call(h.exports,function(b){var e=a[c][1][b];return d(e?e:b)},h,h.exports)}return b[c].exports}for(var e="function"==typeof require&&require,f=0;f<c.length;f++)d(c[f]);return d}({"metadata-parser":[function(a,b){b.exports=a("Oae6Hm")},{}],Oae6Hm:[function(a,b,c){var d=a("./parser"),e=a("./utils");c.create=function(b){var c,f;return e.isBrowser?(c=a("../browser/dom-bufferstream"),f=b.byteLength):(c=a("../node/bufferstream"),f=b.length),new d(new c(b,0,f,!0))}},{"../browser/dom-bufferstream":3,"../node/bufferstream":4,"./parser":1,"./utils":2}],2:[function(a,b,c){!function(){function b(){return"undefined"!=typeof window}c.isBrowser=b(),c.requireOrGlobal=function(c,d){return b()?window[d]:a(c)}}()},{}],3:[function(a,b){!function(){function a(a,b,c,d,e){b=b||0,c=c||a.byteLength-b,this.arrayBuffer=a.slice(b,b+c),this.view=new DataView(this.arrayBuffer,0,this.arrayBuffer.byteLength),this.setBigEndian(d),this.offset=0,this.parentOffset=(e||0)+b}ArrayBuffer.prototype.slice=ArrayBuffer.prototype.slice||function(a,b){a=a||0,b=b||this.byteLength,0>b&&(b=this.byteLength+b),0>a&&(a=this.byteLength+a),0>a&&(a=0),0>b&&(b=0),b>this.byteLength&&(b=this.byteLength),a>b&&(a=b);var c,d=new ArrayBuffer(b-a),e=new Uint8Array(this,a,b-a),f=new Uint8Array(d);for(c=0;b-a>c;c++)f[c]=e[c];return d},a.prototype={setBigEndian:function(a){this.littleEndian=!a},nextUInt8:function(){var a=this.view.getUint8(this.offset);return this.offset+=1,a},nextInt8:function(){var a=this.view.getInt8(this.offset);return this.offset+=1,a},nextUInt16:function(){var a=this.view.getUint16(this.offset,this.littleEndian);return this.offset+=2,a},nextUInt32:function(){var a=this.view.getUint32(this.offset,this.littleEndian);return this.offset+=4,a},nextInt16:function(){var a=this.view.getInt16(this.offset,this.littleEndian);return this.offset+=2,a},nextInt32:function(){var a=this.view.getInt32(this.offset,this.littleEndian);return this.offset+=4,a},nextFloat:function(){var a=this.view.getFloat32(this.offset,this.littleEndian);return this.offset+=4,a},nextDouble:function(){var a=this.view.getFloat64(this.offset,this.littleEndian);return this.offset+=8,a},nextBuffer:function(a){var b=this.arrayBuffer.slice(this.offset,this.offset+a);return this.offset+=a,b},remainingLength:function(){return this.arrayBuffer.byteLength-this.offset},nextString:function(a){var b=this.arrayBuffer.slice(this.offset,this.offset+a),c=new Uint8Array(b),d=String.fromCharCode.apply(null,c),e="";try{e=decodeURIComponent(escape(d))}catch(f){}return this.offset+=a,e},mark:function(){var b=this;return{openWithOffset:function(c){return c=(c||0)+this.offset,new a(b.arrayBuffer,c,b.arrayBuffer.byteLength-c,!b.littleEndian,b.parentOffset)},offset:this.offset,getParentOffset:function(){return b.parentOffset}}},offsetFrom:function(a){return this.parentOffset+this.offset-(a.offset+a.getParentOffset())},skip:function(a){this.offset+=a},branch:function(b,c){return c="number"==typeof c?c:this.arrayBuffer.byteLength-(this.offset+b),new a(this.arrayBuffer,this.offset+b,c,!this.littleEndian,this.parentOffset)}},b.exports=a}()},{}],4:[function(a,b){function c(a,b,c,d){this.buffer=a,this.offset=b||0,c="number"==typeof c?c:a.length,this.endPosition=this.offset+c,this.setBigEndian(d)}c.prototype={setBigEndian:function(a){this.bigEndian=!!a},nextUInt8:function(){var a=this.buffer.readUInt8(this.offset);return this.offset+=1,a},nextInt8:function(){var a=this.buffer.readInt8(this.offset);return this.offset+=1,a},nextUInt16:function(){var a=this.bigEndian?this.buffer.readUInt16BE(this.offset):this.buffer.readUInt16LE(this.offset);return this.offset+=2,a},nextUInt32:function(){var a=this.bigEndian?this.buffer.readUInt32BE(this.offset):this.buffer.readUInt32LE(this.offset);return this.offset+=4,a},nextInt16:function(){var a=this.bigEndian?this.buffer.readInt16BE(this.offset):this.buffer.readInt16LE(this.offset);return this.offset+=2,a},nextInt32:function(){var a=this.bigEndian?this.buffer.readInt32BE(this.offset):this.buffer.readInt32LE(this.offset);return this.offset+=4,a},nextFloat:function(){var a=this.bigEndian?this.buffer.readFloatBE(this.offset):this.buffer.readFloatLE(this.offset);return this.offset+=4,a},nextDouble:function(){var a=this.bigEndian?this.buffer.readDoubleBE(this.offset):this.buffer.readDoubleLE(this.offset);return this.offset+=8,a},nextBuffer:function(a){var b=this.buffer.slice(this.offset,this.offset+a);return this.offset+=a,b},remainingLength:function(){return this.endPosition-this.offset},nextString:function(a){var b=this.buffer.toString("utf8",this.offset,this.offset+a);return this.offset+=a,b},mark:function(){var a=this;return{openWithOffset:function(b){return b=(b||0)+this.offset,new c(a.buffer,b,a.endPosition-b,a.bigEndian)},offset:this.offset}},offsetFrom:function(a){return this.offset-a.offset},skip:function(a){this.offset+=a},branch:function(a,b){return b="number"==typeof b?b:this.endPosition-(this.offset+a),new c(this.buffer,this.offset+a,b,this.bigEndian)}},b.exports=c},{}],1:[function(a,b){function c(a,b,c,d,e,f,g,h,i){this.startMarker=a,this.tags=b,this.iptcTags=c,this.xmpTags=d,this.imageSize=e,this.thumbnailOffset=f,this.thumbnailLength=g,this.thumbnailType=h,this.app1Offset=i}function d(a){this.stream=a,this.flags={readBinaryTags:!1,resolveTagNames:!0,simplifyValues:!0,imageSize:!0,hidePointers:!0,returnTags:!0}}var e=a("./jpeg"),f=a("./exif"),g=a("./iptc"),h=a("./xmp"),i=a("./simplify");c.prototype={hasThumbnail:function(a){return this.thumbnailOffset&&this.thumbnailLength?"string"!=typeof a?!0:"image/jpeg"===a.toLowerCase().trim()?6===this.thumbnailType:"image/tiff"===a.toLowerCase().trim()?1===this.thumbnailType:!1:!1},getThumbnailOffset:function(){return this.app1Offset+6+this.thumbnailOffset},getThumbnailLength:function(){return this.thumbnailLength},getThumbnailBuffer:function(){return this._getThumbnailStream().nextBuffer(this.thumbnailLength)},_getThumbnailStream:function(){return this.startMarker.openWithOffset(this.getThumbnailOffset())},getImageSize:function(){return this.imageSize},getThumbnailSize:function(){var a,b=this._getThumbnailStream();return e.parseSections(b,function(b,c){"SOF"===e.getSectionName(b).name&&(a=e.getSizeFromSOFSection(c))}),a}},d.prototype={enableBinaryFields:function(a){return this.flags.readBinaryTags=!!a,this},enablePointers:function(a){return this.flags.hidePointers=!a,this},enableTagNames:function(a){return this.flags.resolveTagNames=!!a,this},enableImageSize:function(a){return this.flags.imageSize=!!a,this},enableReturnTags:function(a){return this.flags.returnTags=!!a,this},enableSimpleValues:function(a){return this.flags.simplifyValues=!!a,this},parse:function(){var b,d,j,k,l,m,n,o,p,q,r,s,t=this.stream.mark(),u=t.openWithOffset(0),v=this.flags;return v.resolveTagNames?(p=a("./exif-tags"),q=a("./iptc-tags"),b={},d={},j={},r=function(a){return b[a.name]},s=function(a,c){b[a.name]=c}):(b=[],d=[],j=[],r=function(a){var c;for(c=0;c<b.length;++c)if(b[c].type===a.type&&b[c].section===a.section)return b.value},s=function(a,c){var d;for(d=0;d<b.length;++d)if(b[d].type===a.type&&b[d].section===a.section)return b.value=c,void 0}),h.parseTags(u,function(a,b){v.resolveTagNames?j[a]=b:j.push({type:a,value:b})}),e.parseSections(u,function(a,c){var h,j,r=c.offsetFrom(t);237===a&&(j=g.parseTags(c,function(a,b){if(v.resolveTagNames){var c=q.iptc[a];c&&(d[c]?(d[c]=[].concat(d[c]),d[c].push(b)):d[c]=b)}else d.push({type:a,value:b})})),225===a?(h=f.parseTags(c,function(a,c,d,e){if(v.readBinaryTags||7!==e){if(513===c){if(l=d[0],v.hidePointers)return}else if(514===c){if(m=d[0],v.hidePointers)return}else if(259===c&&(n=d[0],v.hidePointers))return;if(v.returnTags)if(v.simplifyValues&&(d=i.simplifyValue(d,e)),v.resolveTagNames){var g=a===f.GPSIFD?p.gps:p.exif,h=g[c];h||(h=p.exif[c]),b[h]=d}else b.push({section:a,type:c,value:d})}}),h&&(o=r)):v.imageSize&&"SOF"===e.getSectionName(a).name&&(k=e.getSizeFromSOFSection(c))}),v.simplifyValues&&(i.castDegreeValues(r,s),i.castDateValues(r,s)),new c(t,b,d,j,k,l,m,n,o)}},b.exports=d},{"./exif":6,"./exif-tags":10,"./iptc":7,"./iptc-tags":11,"./jpeg":5,"./simplify":9,"./xmp":8}],5:[function(a,b){b.exports={parseSections:function(a,b){var c,d;for(a.setBigEndian(!0);a.remainingLength()>0&&218!==d;){if(255!==a.nextUInt8())throw new Error("Invalid JPEG section offset");d=a.nextUInt8(),c=d>=208&&217>=d||218===d?0:a.nextUInt16()-2,b(d,a.branch(0,c)),a.skip(c)}},getSizeFromSOFSection:function(a){return a.skip(1),{height:a.nextUInt16(),width:a.nextUInt16()}},getSectionName:function(a){var b,c;switch(a){case 216:b="SOI";break;case 196:b="DHT";break;case 219:b="DQT";break;case 221:b="DRI";break;case 218:b="SOS";break;case 254:b="COM";break;case 217:b="EOI";break;default:a>=224&&239>=a?(b="APP",c=a-224):a>=192&&207>=a&&196!==a&&200!==a&&204!==a?(b="SOF",c=a-192):a>=208&&215>=a&&(b="RST",c=a-208)}var d={name:b};return"number"==typeof c&&(d.index=c),d}}},{}],6:[function(a,b){function c(a,b){switch(a){case 1:return b.nextUInt8();case 3:return b.nextUInt16();case 4:return b.nextUInt32();case 5:return[b.nextUInt32(),b.nextUInt32()];case 6:return b.nextInt8();case 8:return b.nextUInt16();case 9:return b.nextUInt32();case 10:return[b.nextInt32(),b.nextInt32()];case 11:return b.nextFloat();case 12:return b.nextDouble();default:throw new Error("Invalid format while decoding: "+a)}}function d(a){switch(a){case 1:case 2:case 6:case 7:return 1;case 3:case 8:return 2;case 4:case 9:case 11:return 4;case 5:case 10:case 12:return 8;default:throw new Error("Invalid format: "+a)}}function e(a,b){var e,f,g=b.nextUInt16(),h=b.nextUInt16(),i=d(h),j=b.nextUInt32(),k=i*j;if(k>4&&(b=a.openWithOffset(b.nextUInt32())),2===h){e=b.nextString(j);var l=e.indexOf("\x00");-1!==l&&(e=e.substr(0,l))}else if(7===h)e=b.nextBuffer(j);else for(e=[],f=0;j>f;++f)e.push(c(h,b));return 4>k&&b.skip(4-k),[g,e,h]}function f(a,b,c){var d,f,g=b.nextUInt16();for(f=0;g>f;++f)d=e(a,b),c(d[0],d[1],d[2])}function g(a){var b=a.nextString(6);if("Exif\x00\x00"!==b)throw new Error("Invalid EXIF header");var c=a.mark(),d=a.nextUInt16();if(18761===d)a.setBigEndian(!1);else{if(19789!==d)throw new Error("Invalid TIFF header");a.setBigEndian(!0)}if(42!==a.nextUInt16())throw new Error("Invalid TIFF data");return c}b.exports={IFD0:1,IFD1:2,GPSIFD:3,SubIFD:4,InteropIFD:5,parseTags:function(a,b){var c,d=this;try{c=g(a)}catch(e){return!1}var h,i,j,k=c.openWithOffset(a.nextUInt32());f(c,k,function(a,c,e){switch(a){case 34853:i=c[0];break;case 34665:h=c[0];break;default:b(d.IFD0,a,c,e)}});var l=k.nextUInt32();if(0!==l){var m=c.openWithOffset(l);f(c,m,function(a,c,e){b(d.IFD1,a,c,e)})}if(i){var n=c.openWithOffset(i);f(c,n,function(a,c,e){b(d.GPSIFD,a,c,e)})}if(h){var o=c.openWithOffset(h);f(c,o,function(a,c,e){40965===a?j=c[0]:b(d.InteropIFD,a,c,e)})}if(j){var p=c.openWithOffset(j);f(c,p,function(a,c,e){b(d.InteropIFD,a,c,e)})}return!0}}},{}],7:[function(a,b){function c(a,b){for(var c=0,d=a.openWithOffset(0);d.remainingLength()>0;){var e=d.nextString(4);if("8BIM"===e){var f=d.nextString(2);if(""===f){var g=d.nextInt8();0===g?d.skip(3):d.skip(g+2);for(var h=d.nextInt16(),i=0;h>i;)try{d.nextString(2);var j=d.nextInt8(),k=d.nextInt16(),l=d.nextString(k);b(j,l),i+=5+k}catch(m){i+=5}}}c+=4}}function d(a){var b=a.nextString(14);if("Photoshop 3.0\x00"!==b)throw new Error("Invalid IPTC header");var c=a.mark();return c}b.exports={parseTags:function(a,b){var e;try{e=d(a)}catch(f){return!1}return c(e,b),!0}}},{}],10:[function(a,b){b.exports={exif:{1:"InteropIndex",2:"InteropVersion",11:"ProcessingSoftware",254:"SubfileType",255:"OldSubfileType",256:"ImageWidth",257:"ImageHeight",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",263:"Thresholding",264:"CellWidth",265:"CellLength",266:"FillOrder",269:"DocumentName",270:"ImageDescription",271:"Make",272:"Model",273:"StripOffsets",274:"Orientation",277:"SamplesPerPixel",278:"RowsPerStrip",279:"StripByteCounts",280:"MinSampleValue",281:"MaxSampleValue",282:"XResolution",283:"YResolution",284:"PlanarConfiguration",285:"PageName",286:"XPosition",287:"YPosition",288:"FreeOffsets",289:"FreeByteCounts",290:"GrayResponseUnit",291:"GrayResponseCurve",292:"T4Options",293:"T6Options",296:"ResolutionUnit",297:"PageNumber",300:"ColorResponseUnit",301:"TransferFunction",305:"Software",306:"ModifyDate",315:"Artist",316:"HostComputer",317:"Predictor",318:"WhitePoint",319:"PrimaryChromaticities",320:"ColorMap",321:"HalftoneHints",322:"TileWidth",323:"TileLength",324:"TileOffsets",325:"TileByteCounts",326:"BadFaxLines",327:"CleanFaxData",328:"ConsecutiveBadFaxLines",330:"SubIFD",332:"InkSet",333:"InkNames",334:"NumberofInks",336:"DotRange",337:"TargetPrinter",338:"ExtraSamples",339:"SampleFormat",340:"SMinSampleValue",341:"SMaxSampleValue",342:"TransferRange",343:"ClipPath",344:"XClipPathUnits",345:"YClipPathUnits",346:"Indexed",347:"JPEGTables",351:"OPIProxy",400:"GlobalParametersIFD",401:"ProfileType",402:"FaxProfile",403:"CodingMethods",404:"VersionYear",405:"ModeNumber",433:"Decode",434:"DefaultImageColor",435:"T82Options",437:"JPEGTables",512:"JPEGProc",513:"ThumbnailOffset",514:"ThumbnailLength",515:"JPEGRestartInterval",517:"JPEGLosslessPredictors",518:"JPEGPointTransforms",519:"JPEGQTables",520:"JPEGDCTables",521:"JPEGACTables",529:"YCbCrCoefficients",530:"YCbCrSubSampling",531:"YCbCrPositioning",532:"ReferenceBlackWhite",559:"StripRowCounts",700:"ApplicationNotes",999:"USPTOMiscellaneous",4096:"RelatedImageFileFormat",4097:"RelatedImageWidth",4098:"RelatedImageHeight",18246:"Rating",18247:"XP_DIP_XML",18248:"StitchInfo",18249:"RatingPercent",32781:"ImageID",32931:"WangTag1",32932:"WangAnnotation",32933:"WangTag3",32934:"WangTag4",32995:"Matteing",32996:"DataType",32997:"ImageDepth",32998:"TileDepth",33405:"Model2",33421:"CFARepeatPatternDim",33422:"CFAPattern2",33423:"BatteryLevel",33424:"KodakIFD",33432:"Copyright",33434:"ExposureTime",33437:"FNumber",33445:"MDFileTag",33446:"MDScalePixel",33447:"MDColorTable",33448:"MDLabName",33449:"MDSampleInfo",33450:"MDPrepDate",33451:"MDPrepTime",33452:"MDFileUnits",33550:"PixelScale",33589:"AdventScale",33590:"AdventRevision",33628:"UIC1Tag",33629:"UIC2Tag",33630:"UIC3Tag",33631:"UIC4Tag",33723:"IPTC-NAA",33918:"IntergraphPacketData",33919:"IntergraphFlagRegisters",33920:"IntergraphMatrix",33921:"INGRReserved",33922:"ModelTiePoint",34016:"Site",34017:"ColorSequence",34018:"IT8Header",34019:"RasterPadding",34020:"BitsPerRunLength",34021:"BitsPerExtendedRunLength",34022:"ColorTable",34023:"ImageColorIndicator",34024:"BackgroundColorIndicator",34025:"ImageColorValue",34026:"BackgroundColorValue",34027:"PixelIntensityRange",34028:"TransparencyIndicator",34029:"ColorCharacterization",34030:"HCUsage",34031:"TrapIndicator",34032:"CMYKEquivalent",34118:"SEMInfo",34152:"AFCP_IPTC",34232:"PixelMagicJBIGOptions",34264:"ModelTransform",34306:"WB_GRGBLevels",34310:"LeafData",34377:"PhotoshopSettings",34665:"ExifOffset",34675:"ICC_Profile",34687:"TIFF_FXExtensions",34688:"MultiProfiles",34689:"SharedData",34690:"T88Options",34732:"ImageLayer",34735:"GeoTiffDirectory",34736:"GeoTiffDoubleParams",34737:"GeoTiffAsciiParams",34850:"ExposureProgram",34852:"SpectralSensitivity",34853:"GPSInfo",34855:"ISO",34856:"Opto-ElectricConvFactor",34857:"Interlace",34858:"TimeZoneOffset",34859:"SelfTimerMode",34864:"SensitivityType",34865:"StandardOutputSensitivity",34866:"RecommendedExposureIndex",34867:"ISOSpeed",34868:"ISOSpeedLatitudeyyy",34869:"ISOSpeedLatitudezzz",34908:"FaxRecvParams",34909:"FaxSubAddress",34910:"FaxRecvTime",34954:"LeafSubIFD",36864:"ExifVersion",36867:"DateTimeOriginal",36868:"CreateDate",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureCompensation",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37386:"FocalLength",37387:"FlashEnergy",37388:"SpatialFrequencyResponse",37389:"Noise",37390:"FocalPlaneXResolution",37391:"FocalPlaneYResolution",37392:"FocalPlaneResolutionUnit",37393:"ImageNumber",37394:"SecurityClassification",37395:"ImageHistory",37396:"SubjectArea",37397:"ExposureIndex",37398:"TIFF-EPStandardID",37399:"SensingMethod",37434:"CIP3DataFile",37435:"CIP3Sheet",37436:"CIP3Side",37439:"StoNits",37500:"MakerNote",37510:"UserComment",37520:"SubSecTime",37521:"SubSecTimeOriginal",37522:"SubSecTimeDigitized",37679:"MSDocumentText",37680:"MSPropertySetStorage",37681:"MSDocumentTextPosition",37724:"ImageSourceData",40091:"XPTitle",40092:"XPComment",40093:"XPAuthor",40094:"XPKeywords",40095:"XPSubject",40960:"FlashpixVersion",40961:"ColorSpace",40962:"ExifImageWidth",40963:"ExifImageHeight",40964:"RelatedSoundFile",40965:"InteropOffset",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41485:"Noise",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41489:"ImageNumber",41490:"SecurityClassification",41491:"ImageHistory",41492:"SubjectLocation",41493:"ExposureIndex",41494:"TIFF-EPStandardID",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRatio",41989:"FocalLengthIn35mmFormat",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",42016:"ImageUniqueID",42032:"OwnerName",42033:"SerialNumber",42034:"LensInfo",42035:"LensMake",42036:"LensModel",42037:"LensSerialNumber",42112:"GDALMetadata",42113:"GDALNoData",42240:"Gamma",44992:"ExpandSoftware",44993:"ExpandLens",44994:"ExpandFilm",44995:"ExpandFilterLens",44996:"ExpandScanner",44997:"ExpandFlashLamp",48129:"PixelFormat",48130:"Transformation",48131:"Uncompressed",48132:"ImageType",48256:"ImageWidth",48257:"ImageHeight",48258:"WidthResolution",48259:"HeightResolution",48320:"ImageOffset",48321:"ImageByteCount",48322:"AlphaOffset",48323:"AlphaByteCount",48324:"ImageDataDiscard",48325:"AlphaDataDiscard",50215:"OceScanjobDesc",50216:"OceApplicationSelector",50217:"OceIDNumber",50218:"OceImageLogic",50255:"Annotations",50341:"PrintIM",50560:"USPTOOriginalContentType",50706:"DNGVersion",50707:"DNGBackwardVersion",50708:"UniqueCameraModel",50709:"LocalizedCameraModel",50710:"CFAPlaneColor",50711:"CFALayout",50712:"LinearizationTable",50713:"BlackLevelRepeatDim",50714:"BlackLevel",50715:"BlackLevelDeltaH",50716:"BlackLevelDeltaV",50717:"WhiteLevel",50718:"DefaultScale",50719:"DefaultCropOrigin",50720:"DefaultCropSize",50721:"ColorMatrix1",50722:"ColorMatrix2",50723:"CameraCalibration1",50724:"CameraCalibration2",50725:"ReductionMatrix1",50726:"ReductionMatrix2",50727:"AnalogBalance",50728:"AsShotNeutral",50729:"AsShotWhiteXY",50730:"BaselineExposure",50731:"BaselineNoise",50732:"BaselineSharpness",50733:"BayerGreenSplit",50734:"LinearResponseLimit",50735:"CameraSerialNumber",50736:"DNGLensInfo",50737:"ChromaBlurRadius",50738:"AntiAliasStrength",50739:"ShadowScale",50740:"DNGPrivateData",50741:"MakerNoteSafety",50752:"RawImageSegmentation",50778:"CalibrationIlluminant1",50779:"CalibrationIlluminant2",50780:"BestQualityScale",50781:"RawDataUniqueID",50784:"AliasLayerMetadata",50827:"OriginalRawFileName",50828:"OriginalRawFileData",50829:"ActiveArea",50830:"MaskedAreas",50831:"AsShotICCProfile",50832:"AsShotPreProfileMatrix",50833:"CurrentICCProfile",50834:"CurrentPreProfileMatrix",50879:"ColorimetricReference",50898:"PanasonicTitle",50899:"PanasonicTitle2",50931:"CameraCalibrationSig",50932:"ProfileCalibrationSig",50933:"ProfileIFD",50934:"AsShotProfileName",50935:"NoiseReductionApplied",50936:"ProfileName",50937:"ProfileHueSatMapDims",50938:"ProfileHueSatMapData1",50939:"ProfileHueSatMapData2",50940:"ProfileToneCurve",50941:"ProfileEmbedPolicy",50942:"ProfileCopyright",50964:"ForwardMatrix1",50965:"ForwardMatrix2",50966:"PreviewApplicationName",50967:"PreviewApplicationVersion",50968:"PreviewSettingsName",50969:"PreviewSettingsDigest",50970:"PreviewColorSpace",50971:"PreviewDateTime",50972:"RawImageDigest",50973:"OriginalRawFileDigest",50974:"SubTileBlockSize",50975:"RowInterleaveFactor",50981:"ProfileLookTableDims",50982:"ProfileLookTableData",51008:"OpcodeList1",51009:"OpcodeList2",51022:"OpcodeList3",51041:"NoiseProfile",51043:"TimeCodes",51044:"FrameRate",51058:"TStop",51081:"ReelName",51089:"OriginalDefaultFinalSize",51090:"OriginalBestQualitySize",51091:"OriginalDefaultCropSize",51105:"CameraLabel",51107:"ProfileHueSatMapEncoding",51108:"ProfileLookTableEncoding",51109:"BaselineExposureOffset",51110:"DefaultBlackRender",51111:"NewRawImageDigest",51112:"RawToPreviewGain",51125:"DefaultUserCrop",59932:"Padding",59933:"OffsetSchema",65e3:"OwnerName",65001:"SerialNumber",65002:"Lens",65024:"KDC_IFD",65100:"RawFile",65101:"Converter",65102:"WhiteBalance",65105:"Exposure",65106:"Shadows",65107:"Brightness",65108:"Contrast",65109:"Saturation",65110:"Sharpness",65111:"Smoothness",65112:"MoireFilter"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential",31:"GPSHPositioningError"}}},{}],11:[function(a,b){b.exports={iptc:{80:"By-line",85:"By-line Title",110:"Credits",115:"Source",5:"Object Name",55:"Date Created",90:"City",95:"State",101:"Country",103:"Original Transmission Reference",116:"Copyright",120:"Caption",122:"Caption Writer",105:"Headline",40:"Special Instructions",15:"Category",20:"Supplemental Categories",25:"Keywords"}}},{}],8:[function(a,b){var c=a("./xmp-tags");b.exports={parseTags:function(a,b){a.setBigEndian(!0);for(var d,e,f=12,g="<x:xmpmeta",h="</x:xmpmeta>",i=!1,j=a.branch(0);j.remainingLength()>0;){e=j.nextString(f),d+=e;var k=d.indexOf(g),l=d.indexOf(h);if(-1!==k&&-1!==l){d=d.substr(k,l-k+12),i=!0;break}-1!==k?(d=d.substr(k),i=!0):d.length>2*g.length&&(d=d.substr(g.length))}if(i){d=d.replace(/\n/g,"").replace(/[\t ]+</g,"<").replace(/\>[\t ]+</g,"><").replace(/\>[\t ]+$/g,">");for(var m in c.xmp){var n=c.xmp[m],o=d.match(n.regexp);if(o&&o[n.match]){var p=o[n.match];""!==n.split&&(p=p.split(n.split)),b(m,p)}}}}}},{"./xmp-tags":12}],9:[function(a,b){var c=a("./exif"),d=[{section:c.GPSIFD,type:2,name:"GPSLatitude",refType:1,refName:"GPSLatitudeRef",posVal:"N"},{section:c.GPSIFD,type:4,name:"GPSLongitude",refType:3,refName:"GPSLongitudeRef",posVal:"E"}],e=[{section:c.SubIFD,type:36867,name:"DateTimeOriginal"},{section:c.SubIFD,type:36868,name:"CreateDate"}];b.exports={castDegreeValues:function(a,b){d.forEach(function(c){var d=a(c);if(d){var e=a({section:c.section,type:c.refType,name:c.refName}),f=e===c.posVal?1:-1,g=(d[0]+d[1]/60+d[2]/3600)*f;b(c,g)}})},castDateValues:function(a,b){e.forEach(function(c){var d=a(c);if(d){var e=d.split(" "),f=e[0].split(":"),g=e[1].split(":"),h=new Date;h.setUTCFullYear(f[0]),h.setUTCMonth(f[1]-1),h.setUTCDate(f[2]),h.setUTCHours(g[0]),h.setUTCMinutes(g[1]),h.setUTCSeconds(g[2]),h.setUTCMilliseconds(0);var i=h.getTime()/1e3;b(c,i)}})},simplifyValue:function(a,b){return Array.isArray(a)&&(a=a.map(function(a){return 10===b||5===b?a[0]/a[1]:a}),1===a.length&&(a=a[0])),a}}},{"./exif":6}],12:[function(a,b){b.exports={xmp:{"Creator Email":{regexp:'<Iptc4xmpCore:CreatorContactInfo[^>]+?CiEmailWork="([^"]*)"',match:1,split:""},"Owner Name":{regexp:'<rdf:Description[^>]+?aux:OwnerName="([^"]*)"',match:1,split:""},"Creation Date":{regexp:'<rdf:Description[^>]+?xmp:CreateDate="([^"]*)"',match:1,split:""},"Modification Date":{regexp:'<rdf:Description[^>]+?xmp:ModifyDate="([^"]*)"',match:1,split:""},Label:{regexp:'<rdf:Description[^>]+?xmp:Label="([^"]*)"',match:1,split:""},Credit:{regexp:'<rdf:Description[^>]+?photoshop:Credit="([^"]*)"',match:1,split:""},Source:{regexp:'<rdf:Description[^>]+?photoshop:Source="([^"]*)"',match:1,split:""},Headline:{regexp:'<rdf:Description[^>]+?photoshop:Headline="([^"]*)"',match:1,split:""},City:{regexp:'<rdf:Description[^>]+?photoshop:City="([^"]*)"',match:1,split:""},State:{regexp:'<rdf:Description[^>]+?photoshop:State="([^"]*)"',match:1,split:""},Country:{regexp:'<rdf:Description[^>]+?photoshop:Country="([^"]*)"',match:1,split:""},"Country Code":{regexp:'<rdf:Description[^>]+?Iptc4xmpCore:CountryCode="([^"]*)"',match:1,split:""},Location:{regexp:'<rdf:Description[^>]+?Iptc4xmpCore:Location="([^"]*)"',match:1,split:""},Title:{regexp:"<dc:title>\\s*<rdf:Alt>\\s*(.*?)\\s*</rdf:Alt>\\s*</dc:title>",match:1,split:""},Description:{regexp:"<dc:description>\\s*<rdf:Alt>\\s*<rdf:li(.+?)>(.*?)</rdf:li>\\s*</rdf:Alt>\\s*</dc:description>",match:2,split:""},Creator:{regexp:"<dc:creator>\\s*<rdf:Seq>\\s*<rdf:li>(.*?)</rdf:li>\\s*</rdf:Seq>\\s*</dc:creator>",match:1,split:""},Keywords:{regexp:"<dc:subject>\\s*<rdf:Bag>\\s*<rdf:li>(.*?)</rdf:li>\\s*</rdf:Bag>\\s*</dc:subject>",match:1,split:"</rdf:li><rdf:li>"}}}},{}]},{},["Oae6Hm"]);