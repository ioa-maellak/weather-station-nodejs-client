"use strict";

//Load some modules
var Tail = require("tail").Tail;
var http = require('http');

//the first two arguments are the nodejs and the name of the script. With the slice we omit them.
var myArgs = process.argv.slice(2);
//Check if a file name is supplied.
if (myArgs.length!=3) {
  console.log("Arguments: log_filename ras_id ras_pass");
  process.exit();
}
var fileName = myArgs[0];
var rasId = myArgs[1];
var rasPass = myArgs[2];

//Use this function to receive the responce of an http request.
var responceReceived = function(response){
  //the responce may be sendet as pieces.
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    console.log('Request OK');
    console.log(str);
  });
};

//Use this function when a request fails.
var requestFailed = function(e){
  console.log("Got error: " + e.message);
};

//Open the file in order to read appended lines after we are opening it. The fourth argument starts the reading from the beggining of te file.
var tail = new Tail(fileName, "\n", {},  true);

//When a new line is available, this function will be called.
tail.on("line", function(data) {
  //console.log(data);
  var dataDict = JSON.parse(data);
  dataDict['Date and time'] = dataDict['Date and time'].replace(/\s+/g, 'T');
  //console.log(dataDict);
  //console.log(dataDict.Pressure);
  var urlstr = '/insert.php?id=' + rasId + 
    '&pass=' + rasPass + '&when=' + 
     dataDict['Date and time'] + '&temp-bmp=' +
     dataDict['Temperature-BMP'] + '&pressure=' +
     dataDict['Pressure'] +'&humidity=' +
     dataDict['Relative_Humidity'] +'&temp-dht=' +
     dataDict['Temperature-DHT'] + '&light=' +
     dataDict['Light_Level'] +'&NO2=' + dataDict['Nitrogen_Dioxide'] +
     '&volume=' + dataDict['Volume'];
  //console.log(urlstr);

  var options = {
    host: 'met-ioamaellak.rhcloud.com',
    path: urlstr
  };
  
  //Send the request. If the request is sucessfull, call responceReceived. If there is an error, call requestFailed.
  http.get(options, responceReceived).on("error", requestFailed);
});

//Log if anything goes wrong.
tail.on("error", function(error) {
  console.log('Error ', error);
});

