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

var parseGeometryType = function(type) {
    if (type === "esriGeometryPolygon") {
        return "Polygon";
    }
    return "none";
};

var deserialize = function(js, callback) {
    console.log("begin parsing json");
    var geoJS = {};
    var o = jsonToObject(js);
    var result;
    if (null != o) {
        var geomType;
        geomType = parseGeometryType(o.geometryType);
        
        // prepare the main parts of the GeoJSON
        var geometry = {};
        geometry.type = geomType;
        
        // grab the rings to coordinates
        var coordinates = o.features[0].geometry.rings;
        geometry.coordinates = coordinates;
        
        // convert attributes to properties
        var properties = {};
        var attr = o.features[0].attributes;
        for (var field in attr) {
            properties[field] = attr[field];
        }
        
        geoJS.geometry = geometry;
        geoJS.properties = properties;
        
        result = JSON.stringify(geoJS, function(key, value) {
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