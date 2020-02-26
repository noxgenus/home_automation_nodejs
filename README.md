# Home Automation NodeJS
Raspberry Pi3 NodeJS based Home Automation System<br>

GPIO and Serial based controller.
GPIO buttons control 2/4 channel relay modules such as these: <br>
https://www.kiwi-electronics.nl/tweekanaals-relais-module-5v?search=relay<br><br>

Serial remote control to Arduino based relays can be done with HC11 or HC12 TX/RX transponders.<br>
http://www.14core.com/wiring-the-hc11-hc12-434433mhz-transceiver/
<br><br>


# UPDATE: NodeJS Chromium KIOSK installation/Config<br>
## Raspberry Pi4 / Raspian Buster / NodeJS 10.15.2 / NPM 5.8.0<br><br>

```
1. Install Raspbian Stretch or Buster from SD image
2. Config network if needed
4. apt update && apt upgrade through internets
5. Add user ‘blah’
6. Apt install sudo
7. Add blah to sudoers
9. Apt-get install chromium-browser
10. Git clone this repo
```
	
<br><br>
## Add chromium startup 
<br><br>
## MAIN MONITOR KIOSK COMMAND:<br>

```
Sudo pi
pico ~/.config/lxsession/LXDE-pi/autostart (Stretch)
-or- pico /etc/xdg/lxsession/LXDE-pi/autostart (Buster)
```
<br><br>
Add:<br>

```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@point-rpi

<br><br>
@xset s off
@xset -dpms
@xset s noblank
@unclutter
@chromium-browser --noerrdialogs --disable-infobars --no-sandbox --use-fake-ui-for-media-stream --kiosk --incognito http://localhost:8081
```
<br><br>
## NODE + NPM setup<br>
```
$sudo apt-get install curl
$curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
$nvm install 6
$npm install (from packages)
```
<br><br>

##Wake on Lan:<br>
npm install wake_on_lan<br><br>

##Ping:
npm install ping<br><br>

##Serialport:
npm install serialport<br>
If doesn't work on Pi3 (most likely):<br>
npm install serialport --build-from-source<br><br>

##PigPio:
npm install pigpio

##DHT22 Temperature/Humidity Sensor
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

##UART Config for Raspberry Pi3
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
<br><br>

## Boot node script on startup:<br>
```
$ sudo npm install -g forever
$ sudo npm install -g forever-service
```
<br><br>
## To install NodeJS script as a service:<br>
```
$ cd /home/user/yournodescriptfolder/
$ sudo forever-service install yournodeservice --script yournodescript.js
```
<br><br>
## Node logs:<br>
```
$pico /var/log/vansservice.log
```
<br><br>
#Live read:<br>
```
$tail -f /var/log/vansservice.log
```
<br><br>
## Restart/Status nodeJS service:<br>
```
$service vansservice restart
$service vansservice status
```
