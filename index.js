
"use strict"; // This is for your code to comply with the ECMAScript 5 standard.

var moduleLuftDatenPath = require('path').resolve(__dirname, 'node_modules/scape-luftdaten/../..');
var luftDatenStart 	= require(moduleLuftDatenPath + '/luftdaten-start');
luftDatenStart.start();

