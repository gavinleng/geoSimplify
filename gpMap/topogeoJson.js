/*
 * Created by G on 13/07/2016.
 */


"use strict";

var topojson = require('topojson');

module.exports = exports = {
	getTopojson: function (geoDataArray, cb) {
		var collectionaa = {type: "FeatureCollection", features: geoDataArray};
		
		var topology = topojson.topology({collection: collectionaa}, {
			"property-transform": function (object) {
				return object.properties;
		},
			"coordinate-system":"spherical",
			"quantization": 1e4
		});
		
		topology = topojson.simplify(topology, {"coordinate-system":"spherical", "minimum-area": 1e-8});
		
		cb(topology);
	},
	
	getGeojson: function (topologyObj, cb) {
		// Convert the given TopoJSON to GeoJSON
		try {
			var parsedTopojson = topologyObj;
			var geJSONobj = new this._GeoJSON();
			
			//iterate over each key in the objects of the topojson
			for (var col in parsedTopojson.objects) {
				if (parsedTopojson.objects.hasOwnProperty(col)) {
					var gJ = topojson.feature(parsedTopojson, parsedTopojson.objects[col]);
					
					//merge with the existing GeoJSON Object
					geJSONobj.merge(gJ);
				}
			}
			
			//get the complete GeoJSON data
			var geojson = geJSONobj.getData();
			
			cb(geojson);
		} catch (error) {
			console.log('There was an unknown error converting your TopoJSON to GeoJSON. Sorry.');
			console.log(error, error.message);
		}
	},
	
	_GeoJSON: function () {
		var data;
		
		this.merge = function(input) {
			var self = this;
			
			if (self.data == null) {
				self.data = input;
				
				return;
			}
			//Data already exists, we need to look at the type
			var type = self.data.type;
			
			switch (type) {
				case "FeatureCollection":
					//Featurecollection already exists. We just need to add the Features from the input
					// to the data's Features
					self.data.features = self.data.features.concat(self.getFeatures(input));
					
					break;
				
				case "Feature":
					// we need to create a new FeatureCollection & then concatenate the input
					var ob = {
						"type": "FeatureCollection",
						"features": [self.data]
					};
					
					//now set the data to this new FeatureCollection
					self.data = ob;
					self.data.features = self.data.features.concat(self.getFeatures(input));
					
					break;
				
				//For the 7 types of Geometry objects, We need to make the FeatureCollection & then concatenate
				case "Point":
				case "MultiPoint":
				case "LineString":
				case "MultiLineString":
				case "Polygon":
				case "MultiPolygon":
				case "GeometryCollection":
					var ob = {
						"type": "FeatureCollection",
						"features": self.getFeatures(self.data)
					};
					
					self.data = ob;
					self.data.features = self.data.features.concat(self.getFeatures(input));
					
					break;
				
				default:
					//UnExpected data type
					throw "UnExpected data type";
			}
		};
		
		this.getFeatures = function(geoJSON) {
			var self = this;
			
			var type = geoJSON.type;
			
			switch (type) {
				case "FeatureCollection":
					return geoJSON.features;
				
				case "Feature":
					return [geoJSON];
				
				//For the 7 types of Geometry objects, just fall through to makeFeaturesArray object
				case "Point":
				case "MultiPoint":
				case "LineString":
				case "MultiLineString":
				case "Polygon":
				case "MultiPolygon":
				case "GeometryCollection":
					return self.makeFeaturesArray(geoJSON);
				
				default:
					//UnExpected Input; Return Empty Array
					return [];
			}
		};
		
		this.makeFeaturesArray = function(geom) {
			var feature = {
				"type": "Feature",
				"geometry": geom //Note: There can't be properties.
			};
			
			return [feature];
		};
		
		this.getData = function() {
			var self = this;
			
			return self.data;
		};
	},
	
	getNeighborIds: function (geoDataArray, idObj, cb) {
		var i, index;
		
		var id = idObj.id;
		var idType = idObj.idType;
		
		this.getTopojson(geoDataArray, function (topology) {
			var neighbors = topojson.neighbors(topology.objects.collection.geometries);
			
			var lensetId = topology.objects.collection.geometries.length;
			
			for (i = 0; i < lensetId; i++) {
				if (topology.objects.collection.geometries[i].properties[idType] === id) {
					index = i;
					
					break;
				}
			}
			
			var subsetIndex = neighbors[index];
			
			var lensubsetIndex = subsetIndex.length;
			
			var neighborIdArray = [];
			for (i = 0; i < lensubsetIndex; i++) {
				if (subsetIndex[i] != index) {
					neighborIdArray.push(topology.objects.collection.geometries[subsetIndex[i]].properties[idType]);
				}
			}
			
			cb(neighborIdArray);
		});
	}
};