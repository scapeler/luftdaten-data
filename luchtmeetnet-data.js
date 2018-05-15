/*
** Module: luchtmeetnet-data
**
**
**
**
*/
// **********************************************************************************
"use strict"; // This is for your code to comply with the ECMAScript 5 standard.

var request = require('request');
var fs 		= require('fs');
var sys 	= require('sys');
var _options	= {};
var luchtmeetnetUrl, luchtmeetnetFileName, luchtmeetnetLocalPathRoot, fileFolder, tmpFolder;
var secureSite;
var siteProtocol;
var openiodUrl;
//var loopTimeMax;


// **********************************************************************************


module.exports = {

//1238: Zwolle

	init: function (options) {
		_options				= options;

		secureSite 			= true;
		siteProtocol 		= secureSite?'https://':'http://';
		openiodUrl			= siteProtocol + 'openiod.org/' + _options.systemCode; //SCAPE604';
		//loopTimeMax			= 60000; //ms, 60000=60 sec

		luchtmeetnetUrl 			= 'https://api.luchtmeetnet.nl/open_api/stations/';
		luchtmeetnetFileName 		= 'luchtmeetnet.txt';

		luchtmeetnetLocalPathRoot = options.systemFolderParent + '/luchtmeetnet/';
		fileFolder 			= 'luchtmeetnet';
		tmpFolder 			= luchtmeetnetLocalPathRoot + fileFolder + "/" + 'tmp/';

		// create subfolders
		try {fs.mkdirSync(tmpFolder );} catch (e) {};//console.log('ERROR: no tmp folder found, batch run aborted.'); return } ;

		//console.dir(_options);

		if (options.argvStations == undefined) {
			console.log('Parameter with sensorId(s) is missing, processing aborted.');
			return;
		}
		this.processSensors ();

		console.log('All retrieve actions are activated.');

	},

	processSensors: function (sensorId) {
		var sensorIds = _options.argvStations.split(',');
		console.log(sensorIds);

		for (var i=0;i<sensorIds.length;i++) {
			console.log('Processing sensorId: ' + sensorIds[i]);

			this.reqFile (luchtmeetnetUrl + sensorIds[i] + '/measurements', luchtmeetnetFileName,	false, 'luchtmeetnetdata', sensorIds[i]);

		}

	},

	reqFile: function (url, fileName, unzip, desc, sensorId) {

	var _wfsResult=null;
	console.log("Request start: " + desc + " (" + url + ")");


	function StreamBuffer(req) {
  		var self = this

  		var buffer = []
  		var ended  = false
  		var ondata = null
  		var onend  = null

  		self.ondata = function(f) {
    		console.log("self.ondata")
    		for(var i = 0; i < buffer.length; i++ ) {
      			f(buffer[i])
      			console.log(i);
    		}
    		console.log(f);
    		ondata = f
  		}

  		self.onend = function(f) {
    		onend = f
    		if( ended ) {
      			onend()
    		}
  		}

  		req.on('data', function(chunk) {
    		// console.log("req.on data: ");
    		if (_wfsResult) {
      			_wfsResult += chunk;
    		} else {
      			_wfsResult = chunk;
    		}

    		if( ondata ) {
      			ondata(chunk)
    		} else {
      			buffer.push(chunk)
    		}
  		})

  		req.on('end', function() {
    		//console.log("req.on end")
    		ended = true;

    		if( onend ) {
      			onend()
    		}
  		})

  		req.streambuffer = self
	}

	function writeFile(path, fileName, content) {
  		fs.writeFile(path + fileName, content, function(err) {
    		if(err) {
      			console.log(err);
    		} else {
      			console.log("The file is saved! " + tmpFolder + fileName + ' (unzip:' + unzip + ')');
				if (unzip) {
					var exec = require('child_process').exec;
					var puts = function(error, stdout, stderr) { sys.puts(stdout) }
					exec(" cd " + tmpFolder + " ;  unzip -o " + tmpFolder + fileName + " ", puts);
				}
    		}
  		});
	}

	// send data to SOS service via OpenIoD REST service
	var sendData = function(data) {
	// oud //		http://openiod.com/SCAPE604/openiod?SERVICE=WPS&REQUEST=Execute&identifier=transform_observation&inputformat=insertom&objectid=humansensor&format=xml
	// oud //			&region=EHV		&lat=50.1		&lng=4.0		&category=airquality		&value=1

	//http://localhost:4000/SCAPE604/openiod?SERVICE=WPS&REQUEST=Execute&identifier=transform_observation&action=insertom&sensorsystem=scapeler_shinyei&offering=offering_0439_initial&verbose=true&commit=true&observation=scapeler_shinyei:12.345&neighborhoodcode=BU04390402
	//https://openiod.org/SCAPE604/openiod?SERVICE=WPS&REQUEST=Execute&identifier=transform_observation&action=insertom&sensorsystem=scapeler_shinyei&offering=offering_0439_initial&verbose=true&commit=true&observation=scapeler_shinyei:12.345&neighborhoodcode=BU04390402

		var _url = openiodUrl + '/openiod?SERVICE=WPS&REQUEST=Execute&identifier=transform_observation&action=insertom&sensorsystem=apri-sensor-luchtmeetnet&offering=offering_0439_initial&commit=true';
		_url = _url + '&foi=' + data.foi + '&observation=' + data.observation + '&measurementTime=' + data.measurementTime.toISOString() ;

		console.log(_url);

/*
		request.get(_url)
			.on('response', function(response) {
				console.log(response.statusCode) // 200
				console.log(response.headers['content-type']) // 'image/png'
  			})
			.on('error', function(err) {
				console.log(err)
			})
		;
*/

	};


//	var milliKelvinToCelsius = function(n){return Math.round((n/1e3-273.15)*100)/100};


	var options = {
		uri: url,
		method: 'GET'
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body.observations[0])
			var inRecordJson	= JSON.parse(body);
      var inRecord = inRecordJson.data;
			if (inRecord.length  == 0) {
				console.log('No Luchtmeetnet sensordata found for this url: ' + options.uri );
				return;
			}

//			console.dir(inRecord[0]);
//			console.dir(inRecord[1]);
/*
			var outFile	= '"foi";"sensor";"latlng";"measureDate";"measureValue";"measureUom"\n';


			for (var i=0;i<body.observations.length;i++) {
				console.log(i);
				var inRec			= body.observations[i];
				var outRec			= {};
				outRec.foi			= inRec.procedure; // eg. 'station-35'
				outRec.sensor		= inRec.observableProperty; // eg. 'coraw'
				outRec.latlng		= inRec.featureOfInterest.geometry.coordinates;
				outRec.measureDate	= inRec.resultTime;
				outRec.measureValue	= inRec.result.value;
				outRec.measureUom	= inRec.result.uom;

				var csvRec			= '';
				csvRec				+= '"' + outRec.foi + '";';
				csvRec				+= '"' + outRec.sensor + '";';
				csvRec				+= outRec.latlng + ';';
				csvRec				+= '"' + outRec.measureDate + '";';
				csvRec				+= outRec.measureValue + ';';
				csvRec				+= '"' + outRec.measureUom + '"';

				outFile				+= csvRec + "\n";

			}
			writeFile(tmpFolder, fileName, outFile);
*/

			var data				= {};
//			data.neighborhoodCode	= 'BU07721111';//'BU04390603'; //geoLocation.neighborhoodCode;
//			data.neighborhoodName	= '..'; //geoLocation.neighborhoodName;
//			data.cityCode			= 'GM0772'; //geoLocation.cityCode;
//			data.cityName			= '..'; //geoLocation.cityName;

			//observation=stress:01

			var tmpMeasurements = {};

			var i = inRecord.length - 1;  // only last retrieved measurement


			for (var i=0; i <inRecord.length;i++) {
				var inMeasurement = inRecord[i];
				var measurementTime = new Date(inMeasurement.timestamp_measured);
				//console.log(inMeasurement.timestamp_measured);
				//console.log(measurementTime);
				var nowTime = new Date();
//				console.log(nowTime);
				var timeDiff = new Date().getTime() - measurementTime.getTime();
				//console.log(timeDiff);

				if (timeDiff > 3600000 ) {  // only last hour measurements
					//console.log('ID: '+ sensorId + ' '+ nowTime + ' measurementtime: ' + measurementTime + ' ignore message timediff > 1 hour' );
					continue; // ignore measurement
				}

				data.measurementTime = new Date(inMeasurement.timestamp_measured);
				if (tmpMeasurements[sensorId] == undefined)  tmpMeasurements[sensorId]={};
				var _measurement = tmpMeasurements[sensorId];
			//	_measurement.sensorType = inMeasurement.formula;
			//  console.dir(inMeasurement);
				if (inMeasurement.formula=='PM25') {
				  _measurement.PM25 = inMeasurement.value;
				}
				if (inMeasurement.formula=='PM10') {
				  _measurement.PM10 = inMeasurement.value;
				}
				if (inMeasurement.formula=='NO') {
				  _measurement.NO = inMeasurement.value;
				}
				if (inMeasurement.formula=='NO2') {
				  _measurement.NO2 = inMeasurement.value;
				}
				if (inMeasurement.formula=='SO2') {
				  _measurement.SO2 = inMeasurement.value;
				}
				if (inMeasurement.formula=='O3') {
				  _measurement.O3 = inMeasurement.value;
				}
				if (inMeasurement.formula=='C6H6') {
				  _measurement.C6H6 = inMeasurement.value;
				}
				if (inMeasurement.formula=='C7H8') {
				  _measurement.C7H8 = inMeasurement.value;
				}
				if (inMeasurement.formula=='C8H10') {
				  _measurement.C8H10 = inMeasurement.value;
				}
				if (inMeasurement.formula=='CO') {
				  _measurement.CO = inMeasurement.value;
				}
				if (inMeasurement.formula=='H2S') {
				  _measurement.H2S = inMeasurement.value;
				}
				if (inMeasurement.formula=='PS') {
				  _measurement.PS = inMeasurement.value;
				}
				if (inMeasurement.formula=='NH3') {
				  _measurement.NH3 = inMeasurement.value;
				}
				if (inMeasurement.formula=='FN') {
				  _measurement.FN = inMeasurement.value;
				}
				if (inMeasurement.formula=='Offset') {
				  _measurement.Offset = inMeasurement.value;
				}

		  }
			data.foi = 'LUCHTMEETNET'+sensorId;

//			}
//		    console.log(_measurement.pm25);
//		    console.log(_measurement.pm10);

			data.categories			= [];
			data.observation		= "";
      if (_measurement.PM25) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-PM25:'+ _measurement.PM25;
			}
			if (_measurement.PM10) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-PM10:'+_measurement.PM10;
			}
			if (_measurement.NO) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-NO:'+_measurement.NO;
			}
			if (_measurement.NO2) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-NO2:'+_measurement.NO2;
			}
			if (_measurement.SO2) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-SO2:'+_measurement.SO2;
			}
			if (_measurement.O3) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-O3:'+_measurement.O3;
			}
			if (_measurement.C6H6) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-C6H6:'+_measurement.C6H6;
			}
			if (_measurement.C7H8) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-C7H8:'+_measurement.C7H8;
			}
			if (_measurement.C8H10) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-C8H10:'+_measurement.C8H10;
			}
			if (_measurement.CO) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-CO:'+_measurement.CO;
			}
			if (_measurement.H2S) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-H2S:'+_measurement.H2S;
			}
			if (_measurement.PS) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-PS:'+_measurement.PS;
			}
			if (_measurement.NH3) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-NH3:'+_measurement.NH3;
			}
			if (_measurement.FN) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-FN:'+_measurement.FN;
			}
			if (_measurement.Offset) {
				if(data.observation != "") data.observation		= data.observation + ",";
				data.observation		= data.observation + 'apri-sensor-luchtmeetnet-Offset:'+_measurement.Offset;
			}
      if(data.observation != "") {
				sendData(data);
			}


		}
	});

/*
  	new StreamBuffer(request( options, function(error, response) {
		console.log("Request completed: " + desc + " " );
		var currDate = new Date();
		var iso8601 = currDate.toISOString();

		writeFile(tmpFolder, fileName, '{"retrievedDate": "' + iso8601 + '", "content":' +
			_wfsResult + ' }');
		})
  	);
*/

	} // end of reqFile

}  // end of module.exports
