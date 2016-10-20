 #! /bin/sh

 ### BEGIN INIT INFO
 # Provides:          noip
 # Required-Start:    $remote_fs $syslog
 # Required-Stop:     $remote_fs $syslog
 # Default-Start:     2 3 4 5
 # Default-Stop:      0 1 6
 # Short-Description: Simple script to start a program at boot
 ### END INIT INFO

cd /home/pi/node/


forever start homeauto.js

 exit 0 