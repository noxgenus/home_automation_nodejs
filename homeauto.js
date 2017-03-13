var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);

server.listen(8080);
app.use(express.static('public'));     

// AUDIO 
// -------------------------------------------------------------------------------

var Sound = require('aplay');


// PIGPIO SET GPIO PINS AND OUTPUT MODE
// -------------------------------------------------------------------------------

var Gpio = require('pigpio').Gpio,
  relay1 = new Gpio(21, {mode: Gpio.OUTPUT}),
  relay2 = new Gpio(20, {mode: Gpio.OUTPUT}),
  relay3 = new Gpio(26, {mode: Gpio.OUTPUT}),
  relay4 = new Gpio(19, {mode: Gpio.OUTPUT});

// WAKE ON LAN
// -------------------------------------------------------------------------------
var wol = require('wake_on_lan');

//PING UNDER ROOT
// -------------------------------------------------------------------------------
var ping = require('ping');


// SERIAL SETUP
// -------------------------------------------------------------------------------

var SerialPort = require("serialport");
var parsers = SerialPort.parsers;

var sp = new SerialPort('/dev/ttyAMA0', { 
baudrate: 9600, 
parser: parsers.readline('\r\n')
}, function (err) {
  if (err) {
    return console.log(err.message);
  }
});

// SERIAL PORT RECEIVE
// -------------------------------------------------------------------------------

// OPEN PORT
sp.open(function(err) {
  if (err) {
      console.log(err);
      }
});

// CHECK IF OPEN
sp.on('open', function() {
  console.log('Port open');
});

// ON INCOMING DATA
sp.on('data', function(data) {
  console.log("Receiving Serial Data: " + data);
    var serialdata = data.split('~');
    var serialid = serialdata[0];
    var serialactive = serialdata[1];


// MQ9 GAS SENSOR
   if (serialid == 'gas'){
        io.sockets.emit('relayCallback', {id: serialid, active: serialactive, type: 'gas'});
            if (serialactive == 1){
              //GAS DETECTED!!
              new Sound().play('/home/pi/node/public/audio/224.wav');
              }
    } else {
        io.sockets.emit('relayCallback', {id: serialid, active: serialactive, type: 'serial'});
            if (serialactive == 1){
              new Sound().play('/home/pi/node/public/audio/219.wav');
              } else {
              new Sound().play('/home/pi/node/public/audio/225.wav');
              }
      }
});


// TEMP/HUMID SENSOR DHT22
var sensor = require('node-dht-sensor');

      function gettemp(){
            sensor.read(22, 4, function(err, temperature, humidity) {
              if (!err) {
               console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                         'humidity: ' + humidity.toFixed(1) + '%'
                );
                io.sockets.emit('sensorCallback', {temp: temperature.toFixed(1), humid: humidity.toFixed(1), type: 'temp'});
              } else {
                io.sockets.emit('sensorCallback', {temp: '--', humid: '--', type: 'temp'});

              }
          }); 
        };

      var temperatureinterval = setInterval(gettemp, 10000);



// START SOCKET.IO CONNECTIONS
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {

// STATUS CALL FROM SERIAL TRANSPONDERS

sp.write("status\n", function(err, res) {
  if (err) {
    console.log(err);
    }
});



// PING WORKSTATION/HOSTS FUNCTIONS
// -------------------------------------------------------------------------------

var pingstatus = {};

function pings(host, id) {

    ping.sys.probe(host, function(isAlive){

// Set initial pinstatus on init

        if ((pingstatus['pingstatus' + id] !== false) && (pingstatus['pingstatus' + id] !== true)) {
          pingstatus['pingstatus' + id] = true;
        }

// Only send relayCallback with active status if pingstatus has changed

        if ((isAlive == true) && (pingstatus['pingstatus' + id] == true)) {
          io.sockets.emit('relayCallback', {id: id, active: 1, type: 'wol'});
          new Sound().play('/home/pi/node/public/audio/203.wav');
          pingstatus['pingstatus' + id] = false;
        } else if ((isAlive == false) && (pingstatus['pingstatus' + id] == false)){
          io.sockets.emit('relayCallback', {id: id, active: 0, type: 'wol'});
          new Sound().play('/home/pi/node/public/audio/204.wav');
          pingstatus['pingstatus' + id] = true;
        }
    });

}


// SET PING INTERVAL FOR ALL CLIENTS (ip, buttonID)

function pingall(){
  pings('10.0.0.30', '1');
  pings('10.0.0.31', '2');
  pings('10.0.0.11', '3');
  pings('10.0.0.1', '4');
};  

// INTERVAL PING

var pinginterval = setInterval(pingall, 5000);

// PINGHALT FOR WAKEONLAN

function pinghalt(time){
    clearInterval(pinginterval);
    pingstatus = {};
    setTimeout(function(){
      pinginterval = setInterval(pingall, time);
    }, 4000);
}


// LOCAL GPIO RELAYS
// -------------------------------------------------------------------------------

// FIRST EMIT ACTUAL GPIO STATES TO CLIENT ON CONNECT

   if (relay1.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 1, active: 1, type: 'local'});
      } else if (relay1.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 1, active: 0, type: 'local'});
            }
   if (relay2.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 2, active: 1, type: 'local'});
      } else if (relay2.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 2, active: 0, type: 'local'});
            }
  if (relay3.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 3, active: 1, type: 'local'});
      } else if (relay2.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 3, active: 0, type: 'local'});
            }
  if (relay4.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 4, active: 1, type: 'local'});
      } else if (relay2.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 4, active: 0, type: 'local'});
            }


// STATUS PING WORKSTATIONS

pingall();

// ON CLIENT BUTTON PRESS RECEIVING SOCKET
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

  socket.on('relaycmd', function (data) { 

      var id = data.id;
      var id = id.replace(/wol|local|gas|serial/g, '');
      var type = data.type;
      var wake = data.wake;
      var wake = wake.replace(/-/g, '\:');

      console.log('Relay:' + type + id);


// GPIO LOCAL RELAYS
// -------------------------------------------------------------------------------

    if (type == 'local') {

        if (id == '1') {
            relay1.digitalWrite(relay1.digitalRead() ^ 1);
              if (relay1.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                  new Sound().play('/home/pi/node/public/audio/218.wav');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                  new Sound().play('/home/pi/node/public/audio/217.wav');
              }


        } else if (id == '2') {
            relay2.digitalWrite(relay2.digitalRead() ^ 1);
              if (relay2.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                  new Sound().play('/home/pi/node/public/audio/218.wav');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                  new Sound().play('/home/pi/node/public/audio/217.wav');
              }


        } else if (id == '3') {
              relay3.digitalWrite(relay3.digitalRead() ^ 1);
              if (relay3.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                  new Sound().play('/home/pi/node/public/audio/218.wav');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                  new Sound().play('/home/pi/node/public/audio/217.wav');
              }

        } else if (id == '4') {
              relay4.digitalWrite(relay4.digitalRead() ^ 1);
              if (relay4.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                  new Sound().play('/home/pi/node/public/audio/218.wav');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                  new Sound().play('/home/pi/node/public/audio/217.wav');
              }
        }



// WAKE ON LAN
// -------------------------------------------------------------------------------


    } else if (type == 'wol') {
            console.log(wake);
            wol.wake(wake);
            io.sockets.emit('relayCallback', {id: id, active: 3, type: type});
            pinghalt(5000);
            new Sound().play('/home/pi/node/public/audio/215.wav');


// SERIAL REMOTE HC12 TRANSPONDERS (NOT FINISHED)
// -------------------------------------------------------------------------------

    } else if (type == 'serial') {
            write(id + "\n");
            io.sockets.emit('relayCallback', {id: id, active: 4, type: type});
           new Sound().play('/home/pi/node/public/audio/202.wav');

    }
        
        function write(message) {
            console.log("Sending Serial Data: " + message);
            sp.write(message, function(err, res) {
              if (err) {
                    console.log(err);
              }
          });
        }






// CLOSE RELAYCMD
   });


// CLOSE SHIT
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

});

console.log("running");

new Sound().play('/home/pi/node/public/audio/071.wav');
 


// NODE EXIT HANDLER
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

process.stdin.resume();

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();

    new Sound().play('/home/pi/node/public/audio/224.wav');
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
