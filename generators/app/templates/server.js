var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public/'));
app.listen(<%= port =>);

console.log('Running on http://localhost:<%= port =>');
