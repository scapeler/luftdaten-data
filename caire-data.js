/*
** Module: caire-data-raw
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
var pg = require('pg');

var sqlConnString;

var _options	= {};
var caireUrl, caireFileName, caireLocalPathRoot, fileFolder, tmpFolder;
var secureSite;
var siteProtocol;
var openiodUrl;
var loopTimeMax;

var fileNames, fileNamesIndex;
var _self;

var sqlFile = '';
var restartIndex= 0; //3842; //3840 ; //3687; //3681;3682; //3675;//sensorid 5329  //3391;      errors for sensor id 5331


// **********************************************************************************


module.exports = {

	client: {},

	init: function (options) {
		_options					= options;
		_self = this;

		sqlConnString = options.configParameter.databaseType + '://' +
		options.configParameter.databaseAccount + ':' +
		options.configParameter.databasePassword + '@' +
		options.configParameter.databaseServer + '/' +
		options.systemCode + '_' + options.configParameter.databaseName;

/*
		_self.client = new pg.Client(sqlConnString);
		_self.client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
		});
*/
//		_self.client.end();


		secureSite 			= true;
		siteProtocol 		= secureSite?'https://':'http://';
		openiodUrl			= siteProtocol + 'openiod.org/' + _options.systemCode; //SCAPE604';
		loopTimeMax			= 60000; //ms, 60000=60 sec

		caireUrl 			= 'http://nulwoning.mooo.com:6001/data/json?1';
		caireFileName 		= 'caire.txt';

		caireLocalPathRoot = options.systemFolderParent + '/caire/';
		fileFolder 			= 'caire-10min';
		tmpFolder 			= caireLocalPathRoot + fileFolder + "/" + 'tmp/';

		// create subfolders
		try {fs.mkdirSync(tmpFolder );} catch (e) {};//console.log('ERROR: no tmp folder found, batch run aborted.'); return } ;

		console.dir(_options);

//		if (options.argvStations == undefined) {
//			console.log('Parameter with archivedate is missing, processing with default (actual-2h) date.');
//		}

		this.processArchiveDate();

//		this.processSensors ();

		console.log('All retrieve actions are activated.');

	},

	processArchiveDate: function () {
		//var archiveDate = _options.argvStations;  // one at a time or undefined for yesterday?

		//if (_options.argvStations != undefined) {
		//	archiveDate = _options.argvStations; // eg '2017-02-15-14-35'
		//} else {
		//	var _date 		= new Date(new Date().getTime() - 7200000) ; //7.200.000 2 uur eerder
		//	var _year		= _date.getFullYear();
		//	var _month		= _date.getMonth()+1;
		//	var _day		= _date.getDate();
		//	var _hour		= _date.getHours();
		//	var _minutes	= _date.getMinutes();
		//	var _yearStr	= ''+_year;
		//	var _monthStr	= ''+_month;
		//	var _dayStr		= ''+_day;
		//	var _hourStr	= ''+_hour;
		//	var _minutesStr	= '' + (_minutes - _minutes%5);

		//	_monthStr = _monthStr.length == 1 ? '0' + _monthStr : '' + _monthStr;
		//	_dayStr = _dayStr.length == 1 ? '0' + _dayStr : '' + _dayStr;
		//	_hourStr = _hourStr.length == 1 ? '0' + _hourStr : '' + _hourStr;
		//	_minutesStr = _minutesStr.length == 1 ? '0' + _minutesStr : '' + _minutesStr;


		//	archiveDate = _year + '-' + _monthStr + '-'+ _dayStr + '-' + _hourStr + '-' + _minutesStr; // 2017-02-15-14-35

		//};


		//console.log(archiveDate);

		//console.log('Processing archive date: ' + archiveDate);

		// date: yyyy-mm-dd-hh-mm  mm=5 minutes cycle: 0,5,10,15, etc.
		this.reqFile (caireUrl)	;

		console.log('End of processArchiveDate');

	},


	executeSql: function  (query) {
		console.log('sql start: ');

//		client.connect(function(err) {
//			if(err) {
//				return console.error('could not connect to postgres', err);
//			}
			_self.client.query(query, function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				console.log('sql result is ok ');// + result);
				_self.client.end();
			});
//		});
    },


	reqFile: function (url) {

		var _url = url  ;

		var _wfsResult=null;
//		console.log("Request start: " + fileNames[fileNamesIndex].name + " (" + url + ")");


/*
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
*/

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

		var _url = openiodUrl + '/openiod?SERVICE=WPS&REQUEST=Execute&identifier=transform_observation&action=insertom&sensorsystem=apri-sensor-caire&offering=offering_0439_initial&commit=true';
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
		uri: _url,
		method: 'GET'
	};

	request(options, function (error, response, body) {
		console.log('Processing url '+ _url );

		if (error) {
			console.log(error);
		};
		console.log(response.statusCode);

		if (!error && response.statusCode == 200) {
			//console.log(body.observations[0])
			var _data = JSON.parse(body);
			var inRecords	= _data.SensorData;

			if (inRecords.length  == 0) {
				console.log('No caire 10 minute data found for this url: ' + options.uri );
				return;
			}

//			console.log(inRecords[0]);

			sqlFile = '';
			var sqlRecord="";
			for (var i=0;i<inRecords.length;i++) {
				var inRecord = inRecords[i];
				//if (inRecord.sensor.sensor_type.name != 'SDS011') continue; // end of file ?!

				var _measurementDate = new Date(inRecord.Date);
//				var _minutes = _measurementDate.getMinutes() - (_measurementDate.getMinutes() % 5);
				var _sqlDate = inRecord.Date.substr(0,16)+':00';
//				if (_minutes < 10) _sqlDate += '0';
//				_sqlDate += _minutes+':00';
//
//				for (var j=0;j<inRecord.sensordatavalues.length;j++) {
//					var _sensorType='';
//					if (inRecord.sensordatavalues[j].value_type == 'P1') {
//						_sensorType = '_PM10';
//					}
//					if (inRecord.sensordatavalues[j].value_type == 'P2') {
//						_sensorType = '_PM25';
//					}
//					if (_sensorType == '') continue;

					var _lat = 52.042491;
					var _lon = 6.616678;
					var _location='Groenlo';

					var sqlRecord = "\nINSERT INTO as_measurement (sensor_id, measurement_date,measurement_date_5m,sensor_type,sensor_value,location_id,sensor_lat,sensor_lon,creation_date, geom) " +
					" VALUES (\n" +
					"'Groenlo'," +
					"'" + inRecord.Date + "'," +
					"'" + _sqlDate + "'," +
					"'CAIRE_PM1'," +
					inRecord.PM1 +  "," +
					"'"+_location + "'," +
					_lat + "," +
					_lon + "," +
					"current_timestamp," +
					"ST_SetSRID(ST_MakePoint(" + _lon + ", " + _lat + "), 4326) );";

					sqlRecord += "\nINSERT INTO as_measurement (sensor_id, measurement_date,measurement_date_5m,sensor_type,sensor_value,location_id,sensor_lat,sensor_lon,creation_date, geom) " +
					" VALUES (\n" +
					"'Groenlo'," +
					"'" + inRecord.Date + "'," +
					"'" + _sqlDate + "'," +
					"'CAIRE_PM25'," +
					inRecord.PM25 +  "," +
					"'"+_location + "'," +
					_lat + "," +
					_lon + "," +
					"current_timestamp," +
					"ST_SetSRID(ST_MakePoint(" + _lon + ", " + _lat + "), 4326) );";

					sqlRecord += "\nINSERT INTO as_measurement (sensor_id, measurement_date,measurement_date_5m,sensor_type,sensor_value,location_id,sensor_lat,sensor_lon,creation_date, geom) " +
					" VALUES (\n" +
					"'Groenlo'," +
					"'" + inRecord.Date + "'," +
					"'" + _sqlDate + "'," +
					"'CAIRE_PM10'," +
					inRecord.PM10 +  "," +
					"'"+_location + "'," +
					_lat + "," +
					_lon + "," +
					"current_timestamp," +
					"ST_SetSRID(ST_MakePoint(" + _lon + ", " + _lat + "), 4326) );\n";

					sqlFile=sqlFile.concat(sqlRecord);
//				}

//				if (i<7) {
					console.log(inRecord);
					console.log(sqlRecord);
//				}
			}

			sqlFile=sqlFile.concat('\ncommit;\n');

//			_self.executeSql(sqlFile);


//			return;

//			console.dir(inRecord[0]);

			var data				= {};
			data.neighborhoodCode	= 'BU07721111';//'BU04390603'; //geoLocation.neighborhoodCode;
			data.neighborhoodName	= '..'; //geoLocation.neighborhoodName;
			data.cityCode			= 'GM0772'; //geoLocation.cityCode;
			data.cityName			= '..'; //geoLocation.cityName;

			//observation=stress:01

			var tmpMeasurements = {};

			var i = inRecords.length - 1;  // only one retrieved measurement


//			for (var i=0; i <inRecord.length;i++) {
				var inMeasurement = inRecords[i];
				var measurementTime = new Date(inMeasurement.Date); //+'.000Z');
				inMeasurement.sensorId = 'Caire_Groenlo';
				inMeasurement.locationId = 'Groenlo';
//				console.log(inMeasurement.timestamp);
//				console.log(measurementTime);
			//	var nowTime = new Date();
//				console.log(nowTime);
			//	var timeDiff = new Date().getTime() - measurementTime.getTime();
//				console.log(timeDiff);

//				if (timeDiff >= 60000) {
//					console.log('ID: '+ inMeasurement.sensor.id + ' '+ nowTime + ' measurementtime: ' + measurementTime + ' ignore message timediff > 60 seconds' );
//					return; // ignore measurement older then 1.5 minute. retrieve per minute but delay getting message (maybe?)
//				}


	//			if (tmpMeasurements[inMeasurement.sensor.id] == undefined)  tmpMeasurements[inMeasurement.sensor.id]={};
	//			var _measurement = tmpMeasurements[inMeasurement.sensor.id];
//				var _measurement = {};
//				_measurement.sensorType = inMeasurement.sensor.sensor_type;
//				_measurement.data = inMeasurement.sensordatavalues;

				data.foi = 'CAIRE'+inMeasurement.locationId;

//				console.dir(_measurement);
//				if (_measurement.sensorType.id == 14) {  //name='SDS011'
//				  	for (var j=0; j< _measurement.data.length;j++) {
//						if (_measurement.data[j].value_type == 'P1' ) {
//					  		_measurement.pm10 = _measurement.data[j].value;
//						}
//						if (_measurement.data[j].value_type == 'P2' ) {
//					  		_measurement.pm25 = _measurement.data[j].value;
//						}
//
//					}
//
//				}
//			}
//		    console.log(_measurement.pm25);
//		    console.log(_measurement.pm10);

			data.categories			= [];
			data.observation		=
				'apri-sensor-caire-PM1:'+ inMeasurement.PM1 + ',' +
				'apri-sensor-caire-PM25:'+ inMeasurement.PM25 + ',' +
				'apri-sensor-caire-PM10:'+ inMeasurement.PM10 + ',' +
				'apri-sensor-caire-rHum:'+ inMeasurement.RH + ',' +
				'apri-sensor-caire-temperature:'+ inMeasurement.T;

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
