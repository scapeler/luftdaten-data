/*
** Module: luftdaten-data-raw
**
**
**  node index luftdaten-data-archive 2017-08-30
**
*/
// **********************************************************************************
"use strict"; // This is for your code to comply with the ECMAScript 5 standard.

var request = require('request');
var fs 		= require('fs');
var sys 	= require('sys');
var pg = require('pg');

var sqlConnString;

var _options	= {};
var luftdatenUrl, luftdatenFileName, luftdatenLocalPathRoot, fileFolder, tmpFolder;
var secureSite;
var siteProtocol;
var openiodUrl;
var loopTimeMax;

var fileNames, fileNamesIndex;
var _self;

var sqlFile = '';
var restartIndex= 0; //7117; //
var restartSensorId=''; //'5873'; //'4847';  // restart after this id is found


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

		_self.client = new pg.Client(sqlConnString);
		_self.client.connect(function(err) {
			if(err) {
				return console.error('could not connect to postgres', err);
			}
		});
//		_self.client.end();


		secureSite 			= true;
		siteProtocol 		= secureSite?'https://':'http://';
		openiodUrl			= siteProtocol + 'openiod.org/' + _options.systemCode; //SCAPE604';
		loopTimeMax			= 60000; //ms, 60000=60 sec

		luftdatenUrl 			= 'http://archive.luftdaten.info/';
		luftdatenFileName 		= 'luftdaten.txt';

		luftdatenLocalPathRoot = options.systemFolderParent + '/luftdaten/';
		fileFolder 			= 'archive';
		tmpFolder 			= luftdatenLocalPathRoot + fileFolder + "/" + 'tmp/';

		// create subfolders
		try {fs.mkdirSync(tmpFolder );} catch (e) {};//console.log('ERROR: no tmp folder found, batch run aborted.'); return } ;

		console.dir(_options);

		if (options.argvStations == undefined) {
			console.log('Parameter with archivedate is missing, processing aborted.');
			return;
		}

		this.processArchiveDate();

//		this.processSensors ();

		console.log('All retrieve actions are activated.');

	},

	processArchiveDate: function () {
		var archiveDate = _options.argvStations;  // one at a time or undefined for yesterday?
		console.log(archiveDate);

		console.log('Processing archive date: ' + archiveDate);

		// date: yyyy-mm-dd
		this.reqFolder (luftdatenUrl, archiveDate)	;

	},

	reqFolder: function (url, archiveDate) {

		var _wfsResult=null;
		var _url = url+archiveDate+'/';
		console.log("Request start: Luftdaten archive (" + url + archiveDate + "/)");
		var options = {
			uri: _url,
			method: 'GET'
		};

		var _archiveDate = archiveDate;
		_self = this;
		fileNames = [];

		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				//console.log(body.observations[0])
				var inRecords	= body.split('<a href="20');

				if (inRecords.length  == 0) {
					console.log('No Luftdaten archive data found for this url: ' + options.uri );
					return;
				}

				for (var i=1; i <inRecords.length;i++) { //skip prefix data (html)
					var _fileName = '20'+inRecords[i].split('">20')[0];
					console.log(_fileName);
					var fileMeta = {};
					fileMeta.name = _fileName;
					fileMeta.url = _url;
					fileNames.push(fileMeta);
				}
				fileNamesIndex = 0; //start with first filename entry
				_self.processOneFile();
			}
		});
	},

	processOneFile: function () {
		if (fileNamesIndex <restartIndex) {
			fileNamesIndex = restartIndex;
		}
		if (fileNamesIndex>=fileNames.length) {
			console.log('Number of files processed: '+fileNamesIndex-1);
			return;
		};
		if (fileNames[fileNamesIndex].name.includes('sds011') ) {
			//if(restartSensorId != '' && fileNames[fileNamesIndex].name.includes(restartSensorId)) {
			//	restartSensorId = '';
			//	fileNamesIndex += 1;
			//	_self.processOneFile();
			//} else {
			_self.reqFile();
			// }
		} else {
			fileNamesIndex += 1;
			_self.processOneFile();
		}
	},

	executeSql: function  (query, callback) {
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
//				_self.client.end();
				callback();
			});
//		});
    },


	reqFile: function () {

		var url = fileNames[fileNamesIndex].url + fileNames[fileNamesIndex].name;

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
		//increase index for next file to process
		fileNamesIndex +=1;
		console.log('Processing file '+ fileNames.length + '/'+ fileNamesIndex );

		if (error) {
			console.log(error);
		};
		//console.log(response.statusCode);
		if (!error && response.statusCode == 200) {
			//console.log(body.observations[0])
			var inRecords	= body.split('\n');

			if (inRecords.length  == 0) {
				console.log('No Luftdaten archive data found for this url: ' + options.uri );
				_self.processOneFile();
				return;
			}
			//console.log(inRecords[1]);


//-- sensor_id;sensor_type;location;lat;lon;timestamp;P1;durP1;ratioP1;P2;durP2;ratioP2
//-- 5281;SDS011;2664;50.946;6.652;2017-08-30T00:02:19;17.63;;;11.20;;
//-- 5281;SDS011;2664;50.946;6.652;2017-08-30T00:04:45;11.50;;;9.67;;
//-- 5281;SDS011;2664;50.946;6.652;2017-08-30T00:07:13;14.90;;;11.37;;
			sqlFile = '';
			var sqlRecord="";
			for (var i=1;i<inRecords.length;i++) {
				var fault_code = null;
				var table_name = '';
				var fault_code_attribute = '';
				var fault_code_attribute_value = '';
				var inColumn = inRecords[i].split(';');
				if (inColumn[1] == undefined) continue; // end of file ?!
				if (inColumn.length == 0) continue;

				if (inColumn[1]!='SDS011') {
					console.log('record does not contain correct sensorId ' +inColumn[1]+ ' '+ inRecords[i]);
					break;
				}

	//			if (inColumn[0]<='4620') {
	//				break;
	//			}

				if (inColumn[3] == '' || // missing lat/lon
				    inColumn[4] == ''
					) {
					fault_code = 'missing latlon';
					inColumn[3] = '0';
					inColumn[4] = '0';
				}
				if (inColumn[6] == '' || // invalid P1 value
				    inColumn[9] == ''  // invalid P2 value
					) {
					fault_code = 'missing';
					inColumn[6] = '0';
					inColumn[9] = '0';
				} else {

				if (inColumn[6] == "nan" || // invalid P1 value
				    inColumn[9] == "nan"  // invalid P2 value
					) {
					fault_code = "nan";
					inColumn[6] = '0';
					inColumn[9] = '0';
				} else {
					if (parseFloat(inColumn[6]) >=600 || // invalid P1 value
				   		parseFloat(inColumn[9]) >=600 || // invalid P2 value
						parseFloat(inColumn[6]) <=0  ||
						parseFloat(inColumn[9]) <=0
						) {
						fault_code = 'minmax';
					}
				}
				}
				if (inColumn[0]=='5557') {
					fault_code = 'problem';	//den haag, te hoge waarden en onregelmatig waardoor knipperlicht
				}

				var _measurementDate = new Date(inColumn[5]);
				var _minutes = _measurementDate.getMinutes() - (_measurementDate.getMinutes() % 5);
				var _sqlDate = inColumn[5].substr(0,14);
				if (_minutes < 10) _sqlDate += '0';
				_sqlDate += _minutes+':00';

				if (fault_code != null) {
					table_name = 'as_measurement_fault';
					fault_code_attribute = ' fault_code, ';
					fault_code_attribute_value = " '" + fault_code + "', " ;
				} else {
					table_name = 'as_measurement';
					fault_code_attribute = ' ' ;
					fault_code_attribute_value = ' ';
				}

				var sqlRecord = "\nINSERT INTO " + table_name + " (sensor_id, measurement_date,measurement_date_5m,sensor_type,sensor_value,location_id,sensor_lat,sensor_lon,creation_date,"+fault_code_attribute+" geom) " +
				" VALUES (\n" +
				"'" + inColumn[0] + "'," +
				"'"+inColumn[5] + "'," +
				"'" + _sqlDate + "'," +
				"'"+inColumn[1] + "_PM10'," +
				inColumn[6] +  "," +
				"'"+inColumn[2] + "'," +
				inColumn[3] + "," +
				inColumn[4] + "," +
				"current_timestamp," +
				fault_code_attribute_value +
				"ST_SetSRID(ST_MakePoint(" + inColumn[4] + ", " + inColumn[3] + "), 4326) );" +
				"\nINSERT INTO " + table_name + " (sensor_id, measurement_date,measurement_date_5m,sensor_type,sensor_value,location_id,sensor_lat,sensor_lon,creation_date,"+fault_code_attribute+" geom) " +
				" VALUES (\n" +
				"'" + inColumn[0] + "'," +
				"'"+inColumn[5] + "'," +
				"'" + _sqlDate + "'," +
				"'"+inColumn[1] + "_PM25'," +
				inColumn[9] +  "," +
				"'"+inColumn[2] + "'," +
				inColumn[3] +  "," +
				inColumn[4] +  "," +
				"current_timestamp," +
				fault_code_attribute_value +
				"ST_SetSRID(ST_MakePoint(" + inColumn[4] + ", " + inColumn[3] + "), 4326) );"
				;

				//if (fault_code != null) {
				//	console.log(sqlRecord);
				//}
				sqlFile=sqlFile.concat(sqlRecord);

				if (i==1 ) console.log(sqlRecord);
			}

			sqlFile=sqlFile.concat('\ncommit;\n');

			_self.executeSql(sqlFile, _self.processOneFile);


			//_self.processOneFile();
			return;

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

				if (timeDiff >= 60000) {
					console.log('ID: '+ inMeasurement.sensor.id + ' '+ nowTime + ' measurementtime: ' + measurementTime + ' ignore message timediff > 60 seconds' );
					return; // ignore measurement older then 1.5 minute. retrieve per minute but delay getting message (maybe?)
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

//			sendData(data);


		}
		_self.processOneFile();
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
