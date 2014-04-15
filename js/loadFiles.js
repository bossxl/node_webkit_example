var csv = require("csv");
var files = ['devices', 'bugs', 'testers', 'tester_device'];

function main(listener) {
  var done = 0;
  var data = {};
  function complete(){
    if(done === files.length){
      listener.emit("loadComplete", data);
    }
  }
  function loadData(filename) {
    var arr = [];
    csv()
      .from.path("./" + filename + ".csv", {
        delimiter: ',',
        escape: '"',
        columns: true
      }).on('record', function(row, index) {
        // console.log('#' + index + ' ' + JSON.stringify(row));
        arr.push(row);
      })
      .on('end', function(count) {
        // when writing to a file, use the 'close' event
        // the 'end' event may fire before the file has been written
        // console.log('Number of lines: ' + count);
        data[filename] = arr;
        done++;
        complete();
      })
      .on('error', function(error) {
        console.log(error.message);
      });
  }
  for (var i = 0; i < files.length; i++) {
    loadData(files[i]);
  }
}
exports.main = main
