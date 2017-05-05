/* 
REMOTE ID (DOUBLE NODE + MOTION SENSOR):
Relay ID: 4-5

Serial 433MHz Relay Remote V1.1
-----------------------
By Victor Winters 2017
------ HARDWARE ------

Unit Hardware:

- Adafruit Trinket Pro 5V 16MHz/Arduino NANO V3/Arduino Pro MINI
- HS-12 433 Wireless TX/RX
- Led
- Power supply 9/12V

*/

int relay4 = 4;
int relay5 = 5;

String str;

void setup() {
    Serial.begin(9600);
     
    pinMode(relay4, OUTPUT);
    digitalWrite(relay4, LOW);
    
    pinMode(relay5, OUTPUT);
    digitalWrite(relay5, LOW);
}


void loop() {

    if(Serial.available() > 0) {
        str = Serial.readStringUntil('\n');

// RELAY 1
         if (str == "4") {
                    if (digitalRead(relay4) == HIGH){
                        digitalWrite(relay4, LOW);
                        Serial.println("switch~4~0");
                        
                    } else if (digitalRead(relay4) == LOW) {
                        digitalWrite(relay4, HIGH);
                        Serial.println("switch~4~1");
                        
                    }    
         } else if (str == "5") {
                    if (digitalRead(relay5) == HIGH){
                        digitalWrite(relay5, LOW);
                        Serial.println("switch~5~0");
                        
                    } else if (digitalRead(relay5) == LOW) {
                        digitalWrite(relay5, HIGH);
                        Serial.println("switch~5~1");
                    }  

// STATUS
// FORMAT TO NODEJS: devicetype~serialid~serialactive

        } else if (str == "status") {
                    if (digitalRead(relay4) == HIGH){
                        Serial.println("switch~4~1");
                    } else if (digitalRead(relay4) == LOW) {
                        Serial.println("switch~4~0");    
                    }
                     
                    if (digitalRead(relay5) == HIGH) {
                        Serial.println("switch~5~1");
                    } else if (digitalRead(relay5) == LOW) {
                        Serial.println("switch~5~0");
                    } 
                            
        } else {
             // Serial.println("Unknown Command");
        }
        
        delay(10);
    }



                    

// END VOID LOOP
}


  
