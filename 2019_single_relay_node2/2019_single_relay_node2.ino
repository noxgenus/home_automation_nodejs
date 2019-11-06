/* 
HC12 CHANNEL C+022!

Serial 433MHz Relay Remote V2.1
-----------------------
By Victor Winters 2019
------ HARDWARE ------

Unit Hardware:

- HS-12 433 Wireless TX/RX
- Led
- Power supply 9/12V

*/

#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); // RX, TX

#include <EEPROM.h>
#include <eepromtheshit.h>

// DATATYPES TO INCLUDE IN EEPROM
struct config_t{
  int relayState;
} int2eeprom;

const int relay = 4;
const int led = 5;

int runonce = 0;

String str;

void setup() {
    Serial.begin(9600);
    mySerial.begin(9600);
    
    pinMode(relay, OUTPUT);
    pinMode(led, OUTPUT);
    digitalWrite(relay, LOW);
    digitalWrite(led, LOW);

    int2eeprom.relayState = 0; // Load something
    
    load(); // Load from eeprom
}


void loop() {

    if(mySerial.available() > 0) {
        str = mySerial.readStringUntil('\n');

 
// RELAY
         if (str == "2") { // MAIN DEVICE ID
          
                    if (digitalRead(relay) == HIGH){
                        digitalWrite(relay, LOW);
                        digitalWrite(led, LOW);
                        delay(100);
                        mySerial.println("switch~2~0");
                        int2eeprom.relayState = 0;
                        save();
                        
                    } else if (digitalRead(relay) == LOW) {
                        digitalWrite(relay, HIGH);
                        digitalWrite(led, HIGH);
                        delay(100);
                        mySerial.println("switch~2~1");
                        int2eeprom.relayState = 1;
                        save();
                        
                    }    



// STATUS CALL // FORMAT TO NODEJS: device~id~active

        } else if (str == "status") {
                    if (digitalRead(relay) == HIGH){
                      delay(100);
                        mySerial.println("switch~2~1");
                    } else if (digitalRead(relay) == LOW) {
                      delay(100);
                        mySerial.println("switch~2~0");    
                    }
                            
        } else if (str == "test") {
             // Serial.println("Unknown Command");
             mySerial.println("1");
        } else {
             // Serial.println("Unknown Command");
 
        }
        
        delay(10);
    }





// BOOT FROM EEPROM SETTINGS

     if (runonce == 0){
            if (int2eeprom.relayState == 0){
              digitalWrite(relay, LOW);
              digitalWrite(led, LOW);
              delay(100);
              mySerial.println("switch~1~0");
              
            } else if (int2eeprom.relayState == 1){
              digitalWrite(relay, HIGH);
              digitalWrite(led, HIGH);
              delay(100);
              mySerial.println("switch~1~1");
              
            }     
           runonce = 1;
        }
        
// END VOID LOOP
}


void load() {
EEPROM_readAnything(0,int2eeprom);
}

void save(){
EEPROM_writeAnything(0,int2eeprom);
}
