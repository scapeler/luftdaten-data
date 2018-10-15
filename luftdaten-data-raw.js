/*
** Module: luftdaten-data-raw
**
**
**
**
*/
// **********************************************************************************
"use strict"; // This is for your code to comply with the ECMAScript 5 standard.

var request = require('request');
var fs 		= require('fs');
var sys 	= require('util');
var _options	= {};
var luftdatenUrl, luftdatenFileName, luftdatenLocalPathRoot, fileFolder, tmpFolder;
var secureSite;
var siteProtocol;
var openiodUrl;
var loopTimeMax;


// **********************************************************************************


module.exports = {

//1238: Zwolle

	init: function (options) {
		_options					= options;

		secureSite 			= true;
		siteProtocol 		= secureSite?'https://':'http://';
		openiodUrl			= siteProtocol + 'openiod.org/' + _options.systemCode; //SCAPE604';
		loopTimeMax			= 60000; //ms, 60000=60 sec

		luftdatenUrl 			= 'http://api.luftdaten.info/v1/sensor/';
		luftdatenFileName 		= 'luftdaten.txt';

		luftdatenLocalPathRoot = options.systemFolderParent + '/luftdaten/';
		fileFolder 			= 'luftdaten';
		tmpFolder 			= luftdatenLocalPathRoot + fileFolder + "/" + 'tmp/';

		// create subfolders
		try {fs.mkdirSync(tmpFolder );} catch (e) {};//console.log('ERROR: no tmp folder found, batch run aborted.'); return } ;

		console.dir(_options);

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

			this.reqFile (luftdatenUrl + sensorIds[i] + '/', luftdatenFileName,	false, 'luftdatendata');

		}

	},

	reqFile: function (url, fileName, unzip, desc) {

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

		var _url = openiodUrl + '/openiod?SERVICE=WPS&REQUEST=Execute&identifier=transform_observation&action=insertom&sensorsystem=apri-sensor-luftdaten&offering=offering_0439_initial&commit=true';
		_url = _url + '&region=0439' + '&neighborhoodcode=' + data.neighborhoodCode + '&citycode=' + data.cityCode + '&foi=' + data.foi + '&observation=' + data.observation ;

		console.log(_url);

		request.get(_url)
			.on('response', function(response) {
				console.log(response.statusCode) // 200
				console.log(response.headers['content-type']) // 'image/png'
  			})
			.on('error', function(err) {
				console.log(err)
			})
		;


	};


//	var milliKelvinToCelsius = function(n){return Math.round((n/1e3-273.15)*100)/100};


	var options = {
		uri: url,
		method: 'GET'
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body.observations[0])
			var inRecord	= JSON.parse(body);

			if (inRecord.length  == 0) {
				console.log('No Luftdaten sensordata found for this url: ' + options.uri );
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
			data.neighborhoodCode	= 'BU07721111';//'BU04390603'; //geoLocation.neighborhoodCode;
			data.neighborhoodName	= '..'; //geoLocation.neighborhoodName;
			data.cityCode			= 'GM0772'; //geoLocation.cityCode;
			data.cityName			= '..'; //geoLocation.cityName;

			//observation=stress:01

			var tmpMeasurements = {};

			var i = inRecord.length - 1;  // only last retrieved measurement


//			for (var i=0; i <inRecord.length;i++) {
				var inMeasurement = inRecord[i];
				var measurementTime = new Date(inMeasurement.timestamp+'.000Z');
//				console.log(inMeasurement.timestamp);
//				console.log(measurementTime);
				var nowTime = new Date();
//				console.log(nowTime);
				var timeDiff = new Date().getTime() - measurementTime.getTime();
//				console.log(timeDiff);

				if (timeDiff <= 60000 || timeDiff > 120000 ) {  // must be in the minute one minute ago
					console.log('ID: '+ inMeasurement.sensor.id + ' '+ nowTime + ' measurementtime: ' + measurementTime + ' ignore message timediff > 60 seconds' );
					return; // ignore measurement
				}


				if (tmpMeasurements[inMeasurement.sensor.id] == undefined)  tmpMeasurements[inMeasurement.sensor.id]={};
				var _measurement = tmpMeasurements[inMeasurement.sensor.id];
				_measurement.sensorType = inMeasurement.sensor.sensor_type;
				_measurement.data = inMeasurement.sensordatavalues;

				data.foi = 'LUFTDATEN'+inMeasurement.location.country+inMeasurement.sensor.id;

//				console.dir(_measurement);
				if (_measurement.sensorType.id == 14) {  //name='SDS011'
				  	for (var j=0; j< _measurement.data.length;j++) {
						if (_measurement.data[j].value_type == 'P1' ) {
					  		_measurement.pm10 = _measurement.data[j].value;
						}
						if (_measurement.data[j].value_type == 'P2' ) {
					  		_measurement.pm25 = _measurement.data[j].value;
						}

					}

				}
//			}
//		    console.log(_measurement.pm25);
//		    console.log(_measurement.pm10);

			data.categories			= [];
			data.observation		=
				'apri-sensor-luftdaten-PM25:'+ _measurement.pm25 + ',' +
				'apri-sensor-luftdaten-PM10:'+ _measurement.pm10;
//				'apri-sensor-luftdaten-temperature:'+ milliKelvinToCelsius(inRecord.s_temperatureambient) + ',' +

			sendData(data);


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
