/* 
REMOTE ID (SINGLE NODE + MOTION SENSOR):
Relay ID: 1 (PARKING)
Motion ID: 2

Serial 433MHz Relay Remote V1.1
-----------------------
By Victor Winters 2017
------ HARDWARE ------

Unit Hardware:

- Adafruit Trinket Pro 5V 16MHz/Arduino NANO V3/Arduino Pro MINI
- HS-12 433 Wireless TX/RX
- Led
- Power supply 9/12V
- PIR sensor

*/
#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); // RX, TX

int motionstate = 0;

const int pir = 6;
const int relay1 = 4;
const int led = 5;

int runonce = 0;

String str;

void setup() {
    Serial.begin(9600);
    mySerial.begin(9600);
    
    pinMode(pir, INPUT);
    
    pinMode(relay1, OUTPUT);
    digitalWrite(relay1, LOW);
    
   
}


void loop() {

    if(mySerial.available() > 0) {
        str = mySerial.readStringUntil('\n');

 
// RELAY 1
         if (str == "1") {
                    if (digitalRead(relay1) == HIGH){
                        digitalWrite(relay1, LOW);
                        delay(100);
                        mySerial.println("switch~1~0");
                        
                    } else if (digitalRead(relay1) == LOW) {
                        digitalWrite(relay1, HIGH);
                        delay(100);
                        mySerial.println("switch~1~1");
                        
                    }    


// STATUS
// FORMAT TO NODEJS: devicetype~serialid~serialactive

        } else if (str == "status") {
                    if (digitalRead(relay1) == HIGH){
                      delay(10);
                        mySerial.println("switch~1~1");
                    } else if (digitalRead(relay1) == LOW) {
                      delay(10);
                        mySerial.println("switch~1~0");    
                    }
                            
        } else {
             // Serial.println("Unknown Command");
        }
        
        delay(10);
    }


// PIR READ

//   if (digitalRead(pir) == HIGH){
//        if (motionstate == 0){
//          mySerial.println("motion~2~1");
//          motionstate = 1;
//        }
//      } else if (digitalRead(pir) == LOW) {
//        if (motionstate == 1){
//          mySerial.println("motion~2~0");
//          motionstate = 0;    
//        }
//      }
                    
        if (runonce == 0){
               mySerial.println("switch~1~0");  // switch is off, send status on boot         
               runonce = 1;
        }
        
// END VOID LOOP
}


  
