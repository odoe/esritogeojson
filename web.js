var express = require('express');
var app = module.exports = express.createServer();
var sys = require('sys');
var deserialize = require('./esritogeo').deserialize;

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + 'public' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));    
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

var jsonInput = "test in";
var jsonOutput = "test out";

app.get('/', function(req, res){
    console.log('start of app');
    res.render('index', {
            title: 'EsriJSON to GeoJSON',
            locals: { jsonIn: jsonInput, jsonOut: jsonOutput }
        });
});

app.post('/parse/', function(req, res) {
    console.log("request from post");//, req.body.inJson);
    jsonInput = req.body.inJson.toString();
    deserialize(jsonInput, function(errors, jsonOut){
        jsonOutput = jsonOut;
        console.log("json parsed");
        res.redirect('/');
    });
});

if (!module.parent) {
    var port = process.env.PORT || 3000;
    app.listen(port);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)
}