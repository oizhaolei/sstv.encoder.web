var express = require('express'),
    multer  = require('multer');
var cp = require('child_process');

var upload = multer({ dest: './public/'});
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/', upload.single('photo'),function(req, res){

  console.log(req.file);

  // sstv encoder
  var src = req.file.path;
  var dest = req.file.path + '.wav';
  var cmd =  'python -m pysstv ' + src + ' ' + dest;

  cp.exec(cmd, {}, function(err, stdout, stderr){
    console.log('err: ' + err);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (err) {
      res.json({
        success : false,
        msg : stderr
      });
    } else {
      res.download(dest);
    }
  });

});

app.listen(3000);
