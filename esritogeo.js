var jsonToObject = function(stringIn) {
    console.log("Error: parse with JSON.parse()");
    
    /*
    var data = JSON.parse(stringIn, function(key, value) {
        var type;
        if (value && typeof value === 'object') {
            type = value.type;
            if (typeof type === 'string' && typeof window[type] === 'function') {
                return new (window[type])(value);
            }
        }
        return value;
    });
    */
    var data;
    try {
        data = JSON.parse(stringIn);
        console.log("json converted to object");
    } catch(err) {
        data = null;
    }
    return data;
};

// still not sure on how to translate some of these types
var parseGeometryType = function(type) {
    if (type === "esriGeometryPoint") {
        return "Point";
    } else if (type === "esriGeometryMultipoint") {
        return "MultiPoint";
    } else if (type === "esriGeometryPolyline") {
        return "LineString";
    } else if (type === "esriGeometryPolygon") {
        return "Polygon";
    } /* else if (type === "esriGeometryPolygon") {
        return "MultiLineString";
    } else if (type === "esriGeometryPolygon") {
        return "MultiPolygon";
    }*/ else {
        return "Empty";
    }
};

var featureToGeo = function(feature, geomType) {
    var geometry = {};
    geometry.type = geomType;
    
    // grab the rings to coordinates
    var geom = feature.geometry;
    var coordinates = {};
    if (geom.rings !== "undefined") {
        coordinates = geom.rings;
    } else if (geom.paths !== "undefined") {
        coordinates = geom.paths;
    }
    geometry.coordinates = coordinates;
    
    // convert attributes to properties
    var properties = {};
    var attr = feature.attributes;
    for (var field in attr) {
        properties[field] = attr[field];
    }
    
    var geoJS = {};
    geoJS.geometry = geometry;
    geoJS.properties = properties;
    
    return geoJS;
};

var deserialize = function(js, callback) {
    console.log("begin parsing json");
    
    var o = jsonToObject(js);
    var result;
    if (null !== o) {
        var geomType;
        geomType = parseGeometryType(o.geometryType);
        
        var features = [];
        for (var i = 0, feature = {}; feature = o.features[i]; i++) {
            // prepare the main parts of the GeoJSON
            var feat = featureToGeo(feature, geomType);
            features.push(feat);
        }
        
        var featColl = {};
        featColl.type = "FeatureCollection";
        featColl.features = features;
        
        result = JSON.stringify(featColl, function(key, value) {
            if (typeof value === 'number' && !isFinite(value)) {
                return String(value);
            }
            return value;
        });
        
        console.log("json parsed, return it");
    } else {
        result = "Sorry, JSON could not be parsed.";
    }
    
    callback(null, result);
};

exports.deserialize = deserialize;