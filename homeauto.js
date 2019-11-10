// -------------------------------------------------------------------------------
// VWR NODEJS HOME AUTOMATION FOR PI LINUX BASED SYSTEMS
// V2.9 FOR RASBIAN BUSTER (10)
// -------------------------------------------------------------------------------


const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

server.listen(8080); 

// GLOBAL VARS

var booted = false;
var espeakbusy = false;

// PIGPIO SET GPIO PINS AND OUTPUT MODE
// -------------------------------------------------------------------------------

var Gpio = require('pigpio').Gpio,
  relay1 = new Gpio(21, {mode: Gpio.OUTPUT}),
  relay2 = new Gpio(20, {mode: Gpio.OUTPUT}),
  relay3 = new Gpio(26, {mode: Gpio.OUTPUT}),
  relay4 = new Gpio(19, {mode: Gpio.OUTPUT});

// WAKE ON LAN
// -------------------------------------------------------------------------------
const wol = require('wake_on_lan');

//PING UNDER ROOT
// -------------------------------------------------------------------------------
const ping = require('ping');


// AUDIO (Espeak)
// -------------------------------------------------------------------------------
//EXEC
// -------------------------------------------------------------------------------
const exec = require('exec');
 


// SERIALPORT SETUP
// -------------------------------------------------------------------------------

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/ttyUSB0', { 
    baudRate: 9600
    }, function (err) {
      if (err) {
        return console.log(err.message);
      }
    });

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))


// SERIAL PORT RECEIVE
// -------------------------------------------------------------------------------

// OPEN PORT
port.open(function(err) {
  if (err) {
      console.log(err);
      }
});

// CHECK IF OPEN
port.on('open', function() {
  console.log('Port open');
});

// ON INCOMING DATA
parser.on('data', function(data) {

  console.log("Receiving Serial Data: " + data);
    var serialdata = data.toString().split('~');
    var devicetype = serialdata[0];
    var serialid = serialdata[1];
    var serialactive = serialdata[2];
  

// FROM ARDUINO: devicetype~serialid~serialactive
// CURRENT REMOTE DEVICE TYPES:
// - switch
// - gas
// - motion
// - temp

// SEND TO FRONT

  io.sockets.emit('relayCallback', {id: serialid, active: serialactive, type: devicetype});
   
           

// DEVICE TYPE SPLITS FOR AUDIO

  if (devicetype == 'gas'){     
              if (serialactive == 1){
              //GAS DETECTED!!
                espeakNORM('Warning. Gas detected!');
              }
  } else if (devicetype == 'motion'){ 
              if (serialactive == 1){
              //MOTION DETECTED!
                espeakNORM('Warning. Motion detected!');
              }
  } else {
            if (serialactive == 1){
              //SERIAL SWITCH ACTIVATED
                //
              } else {
                //
              }
      }
});


// TEMP/HUMID SENSOR DHT22
var sensor = require('node-dht-sensor');

      function gettemp(){
            sensor.read(22, 22, function(err, temperature, humidity) {
              if (!err) {
               console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                         'humidity: ' + humidity.toFixed(1) + '%'
                );
                io.sockets.emit('sensorCallback', {temp: temperature.toFixed(1), humid: humidity.toFixed(1), type: 'temp'});
              } else {
                io.sockets.emit('sensorCallback', {temp: '--', humid: '--', type: 'temp'});
                console.log("No temp");
              }
          }); 
            console.log("get temp function interval")
        };

      var temperatureinterval = setInterval(gettemp, 10000);



// START SOCKET.IO CONNECTIONS
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {

// STATUS CALL FROM SERIAL TRANSPONDERS

port.write("status\n", function(err, res) {
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
            espeakID(id,'wake on lan','Sending signal');
          pingstatus['pingstatus' + id] = false;
        } else if ((isAlive == false) && (pingstatus['pingstatus' + id] == false)){
          io.sockets.emit('relayCallback', {id: id, active: 0, type: 'wol'});
            espeakID(id,'Computer','Offline');
          pingstatus['pingstatus' + id] = true;
        }
    });

}


// SET PING INTERVAL FOR ALL CLIENTS (ip, buttonID)

function pingall(){
  pings('10.0.0.30', '1'); // main workstation
  pings('10.0.0.31', '2');  // Workstation i7 2
  pings('10.0.0.11', '3');  // Torrentpi
  pings('10.0.0.2', '4'); // 2nd ROUTER
  pings('10.0.0.4', '5'); // QUAD
   pings('10.0.0.9', '6'); // NXGCAM
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

      id = data.id;
      id = id.replace(/wol|local|gas|switch/g, '');
      type = data.type;
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
                    espeakID(id,type,'activated.');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                    espeakID(id,type,'deactivated.');
              }


        } else if (id == '2') {
            relay2.digitalWrite(relay2.digitalRead() ^ 1);
              if (relay2.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                    espeakID(id,type,'activated.');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                    espeakID(id,type,'deactivated.');
              }


        } else if (id == '3') {
              relay3.digitalWrite(relay3.digitalRead() ^ 1);
              if (relay3.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                  espeakID(id,type,'activated.');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                  espeakID(id,type,'deactivated.');
              }

        } else if (id == '4') {
              relay4.digitalWrite(relay4.digitalRead() ^ 1);
              if (relay4.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: id, active: 1, type: type});
                  espeakID(id,type,'activated.');
              } else {
                  io.sockets.emit('relayCallback', {id: id, active: 0, type: type});
                  espeakID(id,type,'deactivated.');
              }
        }



// WAKE ON LAN
// -------------------------------------------------------------------------------

    } else if (type == 'wol') {
            console.log(wake);
            wol.wake(wake);
            io.sockets.emit('relayCallback', {id: id, active: 3, type: type});
            espeakID(id,'Wake on lan','Signal sent to Computer');
            pinghalt(5000);
            


// SEND TO SERIAL REMOTE HC12 TRANSPONDERS (ONLY ID, ARDUINO WILL CHECK IF HIGH OR LOW)
// -------------------------------------------------------------------------------

    } else if (type == 'switch') {
            write(id + "\n");
            io.sockets.emit('relayCallback', {id: id, active: 4, type: type});
            espeakID(id,'Remote serial','Signal sent to controller');
    }
        
        function write(message) {
            console.log("Sending Serial Data: " + message);
            port.write(message, function(err, res) {
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

setTimeout(function(){
    booted = true;
    espeakNORM('Home Automation System Online.');

 }, 5000);

// NODE EXIT HANDLER
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

process.stdin.resume();

function exitHandler(options, err) {
  espeakNORM('Home Automation System Offline.');
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}


function espeakID(id,type,say){
  if (booted == true && espeakbusy == false){
      espeakbusy = true;
        exec('espeak -ven-uk+m2 -s120 -p5 "' + type + ' ' + id + '. ' + say + '. " --stdout | aplay', function(err, out, code){
      espeakbusy = false;
      console.log("espeak done. Not busy.");
    });
  }
}
function espeakNORM(say){
  if (booted == true && espeakbusy == false){
      espeakbusy = true;
        exec('espeak -ven-uk+m2 -s120 -p5 "' + say + '." --stdout | aplay', function(err, out, code) {
      espeakbusy = false;
       console.log("espeak done. Not busy.");
    });

  }
}


//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
