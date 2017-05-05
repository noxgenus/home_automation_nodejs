/* 
REMOTE ID (DOUBLE NODE + MOTION SENSOR):
Relay ID: 2-3
Motion ID: 1

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

int motionstate = 0;

int pir = 3;
int relay2 = 4;
int relay3 = 5;

String str;

void setup() {
    Serial.begin(9600);
    
    pinMode(pir, INPUT);
    
    pinMode(relay2, OUTPUT);
    digitalWrite(relay2, LOW);
    
    pinMode(relay3, OUTPUT);
    digitalWrite(relay3, LOW);
}


void loop() {

    if(Serial.available() > 0) {
        str = Serial.readStringUntil('\n');

// RELAY 1
         if (str == "2") {
                    if (digitalRead(relay2) == HIGH){
                        digitalWrite(relay2, LOW);
                        Serial.println("switch~2~0");
                        
                    } else if (digitalRead(relay2) == LOW) {
                        digitalWrite(relay2, HIGH);
                        Serial.println("switch~2~1");
                        
                    }    
         } else if (str == "3") {
                    if (digitalRead(relay3) == HIGH){
                        digitalWrite(relay3, LOW);
                        Serial.println("switch~3~0");
                        
                    } else if (digitalRead(relay3) == LOW) {
                        digitalWrite(relay3, HIGH);
                        Serial.println("switch~3~1");
                    }  

// STATUS
// FORMAT TO NODEJS: devicetype~serialid~serialactive

        } else if (str == "status") {
                    if (digitalRead(relay2) == HIGH){
                        Serial.println("switch~2~1");
                    } else if (digitalRead(relay2) == LOW) {
                        Serial.println("switch~2~0");    
                    }
                     
                    if (digitalRead(relay3) == HIGH) {
                        Serial.println("switch~3~1");
                    } else if (digitalRead(relay3) == LOW) {
                        Serial.println("switch~3~0");
                    } 
                            
        } else {
             // Serial.println("Unknown Command");
        }
        
        delay(10);
    }


// PIR READ

   if (digitalRead(pir) == HIGH){
        if (motionstate == 0){
          Serial.println("motion~1~1");
          motionstate = 1;
        }
      } else if (digitalRead(pir) == LOW) {
        if (motionstate == 1){
          Serial.println("motion~1~0");
          motionstate = 0;    
        }
      }
                    

// END VOID LOOP
}


  
