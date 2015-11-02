var express = require('express');
var app = express();

var port = '<%= port %>';

app.use(express.static(__dirname + '/public/'));
app.listen(port);

console.log('<%= appname %> now running on http://localhost:' + port );
