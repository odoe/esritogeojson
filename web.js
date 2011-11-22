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

var test = '{"displayFieldName":"LOWPARCELID","fieldAliases":{"LOWPARCELID":"Lowest Parcel Identification Number"},"geometryType":"esriGeometryPolygon","spatialReference":{"wkid":4326},"fields":[{"name":"LOWPARCELID","type":"esriFieldTypeString","alias":"Lowest Parcel Identification Number","length":30}],"features":[{"attributes":{"LOWPARCELID":"1902226080"},"geometry":{"rings":[[[-83.231458627236648,42.617199350582993],[-83.231635236861806,42.617378536183793],[-83.231669512792919,42.617422957559519],[-83.231193468607543,42.617678900083554],[-83.230976370344521,42.617458631003402],[-83.231458627236648,42.617199350582993]]]}}]}';

var jsonInput = test;
var jsonOutput = "this will be GeoJSON";

app.get('/', function(req, res){
    console.log('start of app');
    res.render('index', {
            title: 'EsriJSON to GeoJSON (experimental): Only works on Polygons for now',
            locals: { jsonIn: jsonInput, jsonOut: jsonOutput }
        });
});

app.post('/', function(req, res) {
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
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}