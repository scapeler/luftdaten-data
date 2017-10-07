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

		luftdatenUrl 			= 'http://api.luftdaten.info/static/v1/data/data.json.'; 
		luftdatenFileName 		= 'luftdaten.txt';

		luftdatenLocalPathRoot = options.systemFolderParent + '/luftdaten/';
		fileFolder 			= 'archive-5min';
		tmpFolder 			= luftdatenLocalPathRoot + fileFolder + "/" + 'tmp/';

		// create subfolders
		try {fs.mkdirSync(tmpFolder );} catch (e) {};//console.log('ERROR: no tmp folder found, batch run aborted.'); return } ;

		console.dir(_options);
		
		if (options.argvStations == undefined) {
			console.log('Parameter with archivedate is missing, processing with default (actual-2h) date.');
		}
		
		this.processArchiveDate();
		
//		this.processSensors (); 

		console.log('All retrieve actions are activated.');

	},
	
	processArchiveDate: function () {
		var archiveDate = _options.argvStations;  // one at a time or undefined for yesterday?
		
		if (_options.argvStations != undefined) {
			archiveDate = _options.argvStations; // eg '2017-02-15-14-35'
		} else {
			var _date 		= new Date(new Date().getTime() - 7200000) ; //7.200.000 2 uur eerder
			var _year		= _date.getFullYear();
			var _month		= _date.getMonth()+1;
			var _day		= _date.getDate();
			var _hour		= _date.getHours();
			var _minutes	= _date.getMinutes();	
			var _yearStr	= ''+_year;
			var _monthStr	= ''+_month;
			var _dayStr		= ''+_day;
			var _hourStr	= ''+_hour;
			var _minutesStr	= '' + (_minutes - _minutes%5);
			
			_monthStr = _monthStr.length == 1 ? '0' + _monthStr : '' + _monthStr;
			_dayStr = _dayStr.length == 1 ? '0' + _dayStr : '' + _dayStr;
			_hourStr = _hourStr.length == 1 ? '0' + _hourStr : '' + _hourStr;
			_minutesStr = _minutesStr.length == 1 ? '0' + _minutesStr : '' + _minutesStr;
					
			
			archiveDate = _year + '-' + _monthStr + '-'+ _dayStr + '-' + _hourStr + '-' + _minutesStr; // 2017-02-15-14-35		

		};	
			

		console.log(archiveDate);
		
		console.log('Processing archive date: ' + archiveDate);
			
		// date: yyyy-mm-dd-hh-mm  mm=5 minutes cycle: 0,5,10,15, etc.
		this.reqFile (luftdatenUrl, archiveDate)	;
		
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
//				_self.client.end();
			});
//		});
    },

	
	reqFile: function (url,archiveDate) {
		
		var _url = url + archiveDate ;
	
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
		uri: _url,
		method: 'GET'
	};

	request(options, function (error, response, body) {
		console.log('Processing file '+ _url );

		if (error) {
			console.log(error);
		};
		console.log(response.statusCode);
		if (!error && response.statusCode == 200) {
			//console.log(body.observations[0])
			var inRecords	= JSON.parse(body);
						
			if (inRecords.length  == 0) {
				console.log('No Luftdaten 5 minute data found for this url: ' + options.uri );
				return;
			}
			
//			console.log(inRecords[0]);
			
			sqlFile = '';
			var sqlRecord="";
			for (var i=0;i<inRecords.length;i++) {
				var inRecord = inRecords[i];
				if (inRecord.sensor.sensor_type.name != 'SDS011') continue; // end of file ?!
				
				var _measurementDate = new Date(inRecord.timestamp);
				var _minutes = _measurementDate.getMinutes() - (_measurementDate.getMinutes() % 5);
				var _sqlDate = inRecord.timestamp.substr(0,14);
				if (_minutes < 10) _sqlDate += '0';
				_sqlDate += _minutes+':00';

				for (var j=0;j<inRecord.sensordatavalues.length;j++) {
					var _sensorType='';
					if (inRecord.sensordatavalues[j].value_type == 'P1') {
						_sensorType = '_PM10';
					}
					if (inRecord.sensordatavalues[j].value_type == 'P2') {
						_sensorType = '_PM25';
					}
					if (_sensorType == '') continue;
								
					var sqlRecord = "\nINSERT INTO as_measurement (sensor_id, measurement_date,measurement_date_5m,sensor_type,sensor_value,location_id,sensor_lat,sensor_lon,creation_date, geom) " +
					" VALUES (\n" +
					"'" + inRecord.sensor.id + "'," +
					"'" + inRecord.timestamp + "'," +
					"'" + _sqlDate + "'," +	
					"'" + inRecord.sensor.sensor_type.name + _sensorType  + "'," +
					inRecord.sensordatavalues[j].value +  "," +
					"'"+inRecord.location.id + "'," +
					inRecord.location.latitude + "," +
					inRecord.location.longitude + "," +
					"current_timestamp," +
					"ST_SetSRID(ST_MakePoint(" + inRecord.location.longitude + ", " + inRecord.location.latitude + "), 4326) );";

					sqlFile=sqlFile.concat(sqlRecord);
				}
				
				if (i<7) {
					console.log(inRecord);
					console.log(sqlRecord);
				}	
			}
			
			sqlFile=sqlFile.concat('\ncommit;\n');

	//		_self.executeSql(sqlFile);

			
			return;
			
//			console.dir(inRecord[0]);
			
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
