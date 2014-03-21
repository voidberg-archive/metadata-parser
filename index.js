var fs = require('fs');
var parser = require('./src/common/metadata-parser');

// var fd = fs.openSync('sample-images/Canon EOS 20D (1).jpg', "r");
// var data = fs.readSync(fd, 128 * 1000);

// var p1 = parser.create(data);
// p1.enablePointers(true);
// // p1.enableTagNames(false);

// var result = p1.parse();

// console.log(result);


fs.readFile('test.jpg', function (err, data) {
  if (err) {
    throw err;
  }

  var p1 = parser.create(data);
  p1.enablePointers(true);
  // p1.enableTagNames(false);

  var result = p1.parse();

  console.log(result);
});
