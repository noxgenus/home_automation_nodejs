# Home Automation NodeJS
Raspberry Pi3 NodeJS based Home Automation System

GPIO and Serial based controller.
GPIO buttons control 2/4 channel relay modules such as these: <br>
https://www.kiwi-electronics.nl/tweekanaals-relais-module-5v?search=relay<br><br>

Serial remote control to Arduino based relays can be done with HC11 or HC12 TX/RX transponders.<br>
http://www.14core.com/wiring-the-hc11-hc12-434433mhz-transceiver/
<br><br>


# NodeJS installation/Config on Raspberry Pi3 B

#NodeJS:

wget https://nodejs.org/dist/v5.0.0/node-v5.0.0-linux-armv7l.tar.gz 
<br>tar -xvf node-v5.0.0-linux-armv7l.tar.gz<br>
cd node-v5.0.0-linux-armv7l<br>
sudo cp -R * /usr/local/<br>
Check version using: node -v and npm -v node -v v5.0.0 npm 3.3.6<br><br>
npm install express<br>
npm install socket.io<br>

#Wake on Lan:
npm install wake_on_lan

#Ping:
npm install ping

#Serialport:
npm install serialport<br>
If doesn't work on Pi3 (most likely):<br>
npm install serialport --build-from-source<br>

#PigPio:
npm install pigpio

#DHT22 Temperature/Humidity Sensor

First download and install BCM2835 driver<br>
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.44.tar.gz<br>
tar zxvf bcm2835-1.44.tar.gz<br>
cd bcm2835-1.44<br>
./configure<br>
make<br>
sudo make check<br>
sudo make install<br><br>

Then install npm package:<br>
npm install node-dht-sensor<br><br>

#Folder structure:
homeauto.js index.html

Run using 'node homeauto.js'

#UART Config for Raspberry Pi3

! By default /dev/AMA0 (TX/RX pin) is now mapped to the BT transmitter, edit /boot/config.txt:<br>
On end of file, change <br>
'enable_uart=0' to 'enable_uart=1' <br>
and below that add 'dtoverlay=pi3-miniuart-bt' <br>

#Touchscreen 800x480 (Adafruit) full kiosk config

Setting correct screen size, edit /boot/config.txt:<br><br>

uncomment to force a specific HDMI mode (this will force VGA)<br>
hdmi_group=2<br>
hdmi_mode=1<br>
hdmi_mode=87<br>
hdmi_cvt 800 480 60 0 0 0<br><br>

Install iceweasel:<br>
apt-get install iceweasel<br><br>

Install Firefox R-Kiosk add-on from within iceweasel:<br>
https://addons.mozilla.org/en-us/firefox/addon/r-kiosk/
<br><br>

For keeping screen from going in stand-by edit:<br>
/etc/lightdm/lightdm.conf<br><br>

in the SeatDefaults section it gives the command for starting the X server which I modified to get it to turn off the screen saver as well as dpms<br><br>

[SeatDefaults]<br><br>

xserver-command=X -s 0 -dpms<br><br>

#Auto boot NodeJS app on startup

cd /etc/init.d<br>
nano boothomeauto<br>

Paste this:<br><br>

<code>
#!/bin/sh<br>
#/etc/init.d/boothomeauto<br>
export PATH=$PATH:/home/pi/node<br>
export NODE_PATH=$NODE_PATH:/home/pi/node/node_modules<br>

case "$1" in<br>
start)<br>
exec forever --sourceDir=/home/pi/node -p /home/pi/node homeauto.js  #scriptarguments<br>
;;<br>
stop)<br>
exec forever stop --sourceDir=/home/pi/node homeauto.js<br>
;;<br>
*)<br>
echo "Usage: /etc/init.d/boothomeauto {start|stop}"<br>
exit 1<br>
;;<br>
esac<br>
exit 0<br><br>
</code>

chmod 755 /etc/init.d/boothomeauto<br><br>

Test it:<br>

sh /etc/init.d/boothomeauto start<br><br>

Make it bootable:<br>

update-rc.d boothomeauto defaults<br><br>

To remove it from boot:<br>

update-rc.d -f boothomeauto remove<br><br>

