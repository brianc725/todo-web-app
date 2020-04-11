const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

const db = require('./db.js');
const apiController = require('./api/controller.js');

app.use(express.static('public'));
app.use(express.json());

app.use(
  middleware(compiler, {
    publicPath: config.output.publicPath
  })
);

app.use('/api/', apiController);

app.get("*", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('* your app is listening on port ' + listener.address().port);
});
