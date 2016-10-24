var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);

server.listen(8080);
app.use(express.static('public'));      

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
      io.sockets.emit('relayCallback', {id: serialid, active: serialactive, type: serial});
});






// START SOCKET.IO CONNECTIONS
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {

// STATUS PING WORKSTATIONS

pingall();


// STATUS CALL FROM SERIAL TRANSPONDERS

sp.write("status\n", function(err, res) {
  if (err) {
    console.log(err);
    }
});


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
          pingstatus['pingstatus' + id] = false;
        } else if ((isAlive == false) && (pingstatus['pingstatus' + id] == false)){
          io.sockets.emit('relayCallback', {id: id, active: 0, type: 'wol'});
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





// ON CLIENT BUTTON PRESS RECEIVING SOCKET
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

  socket.on('relaycmd', function (data) { 

    console.log('Relay:' + data.value);

// GPIO LOCAL RELAYS
// -------------------------------------------------------------------------------

        if (data.value == 'local1') {

              var node = data.value;
              var node = node.replace('local', '');

            relay1.digitalWrite(relay1.digitalRead() ^ 1);
              if (relay1.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: node, active: 1, type: 'local'});
              } else {
                  io.sockets.emit('relayCallback', {id: node, active: 0, type: 'local'});
              }


        } else if (data.value == 'local2') {

              var node = data.value;
              var node = node.replace('local', '');

            relay2.digitalWrite(relay2.digitalRead() ^ 1);
              if (relay2.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: node, active: 1, type: 'local'});
              } else {
                  io.sockets.emit('relayCallback', {id: node, active: 0, type: 'local'});
              }


        } else if (data.value == 'local3') {

              var node = data.value;
              var node = node.replace('local', '');

            relay3.digitalWrite(relay3.digitalRead() ^ 1);
              if (relay3.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: node, active: 1, type: 'local'});
              } else {
                  io.sockets.emit('relayCallback', {id: node, active: 0, type: 'local'});
              }

        } else if (data.value == 'local4') {
              
              var node = data.value;
              var node = node.replace('local', '');

            relay4.digitalWrite(relay4.digitalRead() ^ 1);
              if (relay4.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: node, active: 1, type: 'local'});
              } else {
                  io.sockets.emit('relayCallback', {id: node, active: 0, type: 'local'});
              }


// WAKE ON LAN
// -------------------------------------------------------------------------------



    // WORKSTATION 1 VIC
        } else if (data.value == 'wol1') {

            var node = data.value;
            var node = node.replace('wol', '');

            console.log("Wake on Lan 6C:F0:49:E6:73:EB");
            wol.wake('6C:F0:49:E6:73:EB');
            io.sockets.emit('relayCallback', {id: node, active: 3, type: 'wol'});
            pinghalt(5000);


    // WORKSTATION 2 LIZ
        } else if (data.value == 'wol2') {


            var node = data.value;
            var node = node.replace('wol', '');

            console.log("Wake on Lan 60:E3:27:17:77:4E");
            wol.wake('60:E3:27:17:77:4E');
            io.sockets.emit('relayCallback', {id: node, active: 3, type: 'wol'});
            pinghalt(5000);

    // MEDIA PI TORRENT
        } else if (data.value == 'wol3') {


            var node = data.value;
            var node = node.replace('wol', '');
            console.log("Wake on Lan B8:27:EB:28:E2:2E");
            wol.wake('B8:27:EB:28:E2:2E');
            io.sockets.emit('relayCallback', {id: node, active: 3, type: 'wol'});
            pinghalt(5000);

    // MAIN ROUTER
        } else if (data.value == 'wol4') {


            var node = data.value;
            var node = node.replace('wol', '');
            console.log("Wake on Lan E8:94:F6:68:4D:D6");
            wol.wake('E8:94:F6:68:4D:D6');
            io.sockets.emit('relayCallback', {id: node, active: 3, type: 'wol'});
            pinghalt(5000);




// SERIAL REMOTE HC12 TRANSPONDERS (NOT FINISHED)
// -------------------------------------------------------------------------------


        } else if (data.value == 'serial1') {
            var node = data.value;
            var node = node.replace('serial', '');
            write(data.value + "\n");
            io.sockets.emit('relayCallback', {id: node, active: 4, type: 'serial'});

        } else if (data.value == 'serial2') {
            var node = data.value;
            var node = node.replace('serial', '');
            write(data.value + "\n");
            io.sockets.emit('relayCallback', {id: node, active: 4, type: 'serial'});
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


// NODE EXIT HANDLER
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

process.stdin.resume();

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
