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
    return console.log('Error: ', err.message);
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
      io.sockets.emit('relayCallback', {id: serialid, active: serialactive});
});



// START SOCKET.IO CONNECTIONS
// -------------------------------------------------------------------------------
// -------------------------------------------------------------------------------

io.sockets.on('connection', function (socket) {


      // ASK STATUS FROM SERIAL TRANSPONDERS


    sp.write("status\r", function(err, res) {
              if (err) {
                    console.log(err);
              }
            });


// LOCAL GPIO RELAYS
// -------------------------------------------------------------------------------

// FIRST EMIT ACTUAL GPIO STATES TO CLIENT ON CONNECT

   if (relay1.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 1, active: 1});
      } else if (relay1.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 1, active: 0});
            }
   if (relay2.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 2, active: 1});
      } else if (relay2.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 2, active: 0});
            }
  if (relay3.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 3, active: 1});
      } else if (relay2.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 3, active: 0});
            }
  if (relay4.digitalRead() == 1) {
                io.sockets.emit('relayCallback', {id: 4, active: 1});
      } else if (relay2.digitalRead() == 0){
                io.sockets.emit('relayCallback', {id: 4, active: 0});
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
          io.sockets.emit('relayCallback', {id: id, active: 1});
          pingstatus['pingstatus' + id] = false;
        } else if ((isAlive == false) && (pingstatus['pingstatus' + id] == false)){
          io.sockets.emit('relayCallback', {id: id, active: 0});
          pingstatus['pingstatus' + id] = true;
        }
    });

}


// SET PING INTERVAL FOR ALL CLIENTS (ip, buttonID)

function pingall(){
  pings('10.0.0.30', '5');
  pings('10.0.0.31', '6');
  pings('10.0.0.11', '7');
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

        if (data.value == 1) {
            relay1.digitalWrite(relay1.digitalRead() ^ 1);
              if (relay1.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: data.value, active: 1});
              } else {
                  io.sockets.emit('relayCallback', {id: data.value, active: 0});
              }
        } else if (data.value == 2) {
            relay2.digitalWrite(relay2.digitalRead() ^ 1);
              if (relay2.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: data.value, active: 1});
              } else {
                  io.sockets.emit('relayCallback', {id: data.value, active: 0});
              }
        } else if (data.value == 3) {
            relay3.digitalWrite(relay3.digitalRead() ^ 1);
              if (relay3.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: data.value, active: 1});
              } else {
                  io.sockets.emit('relayCallback', {id: data.value, active: 0});
              }
        } else if (data.value == 4) {
            relay4.digitalWrite(relay4.digitalRead() ^ 1);
              if (relay4.digitalRead() == 1) {
                  io.sockets.emit('relayCallback', {id: data.value, active: 1});
              } else {
                  io.sockets.emit('relayCallback', {id: data.value, active: 0});
              }


// WAKE ON LAN
// -------------------------------------------------------------------------------



    // WORKSTATION 1
        } else if (data.value == 5) {
            console.log("Wake on Lan 6C:F0:49:E6:73:EB");
            wol.wake('6C:F0:49:E6:73:EB');
            io.sockets.emit('relayCallback', {id: data.value, active: 3});
            pinghalt(5000);


    // WORKSTATION 2
        } else if (data.value == 6) {
            console.log("Wake on Lan 6C:F0:49:E6:73:EB");
            wol.wake('6C:F0:49:E6:73:EB');
            io.sockets.emit('relayCallback', {id: data.value, active: 3});
            pinghalt(5000);

    // MEDIA PI
        } else if (data.value == 7) {
            console.log("Wake on Lan B8:27:EB:28:E2:2E");
            wol.wake('B8:27:EB:28:E2:2E');
            io.sockets.emit('relayCallback', {id: data.value, active: 3});
            pinghalt(5000);




// SERIAL REMOTE HC12 TRANSPONDERS (NOT FINISHED)
// -------------------------------------------------------------------------------


        } else if (data.value == 8) {
            write(data.value + "\r");
            io.sockets.emit('relayCallback', {id: data.value, active: 4});

        } else if (data.value == 9) {
            write(data.value + "\r");
            io.sockets.emit('relayCallback', {id: data.value, active: 4});
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
