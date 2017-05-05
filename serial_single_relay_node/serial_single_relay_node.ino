/* 
REMOTE ID (SINGLE NODE): 1
Serial 433MHz Relay Remote V1.1
-----------------------
By Victor Winters 2016
------ HARDWARE ------

Unit Hardware:

- Adafruit Trinket Pro 5V 16MHz/Arduino NANO V3/Arduino Pro MINI
- HS-12 433 Wireless TX/RX
- Led
- Power supply 9/12V

*/

int relay1 = 4;
String str;

void setup() {
    Serial.begin(9600);
    
    pinMode(relay1, OUTPUT);
    digitalWrite(relay1, LOW);
}


void loop() {
  
    if(Serial.available() > 0) {
        str = Serial.readStringUntil('\n');
   
      

         if (str == "1") {
                    if (digitalRead(relay1) == HIGH){
                        digitalWrite(relay1, LOW);
                        Serial.println("switch~1~0");
                        
                    } else if (digitalRead(relay1) == LOW) {
                        digitalWrite(relay1, HIGH);
                        Serial.println("switch~1~1");
                        
                    }    
// STATUS
// FORMAT TO NODEJS: devicetype~serialid~serialactive

        } else if (str == "status") {
                    if (digitalRead(relay1) == HIGH){
                        Serial.println("switch~1~1");
                    } else if (digitalRead(relay1) == LOW) {
                        Serial.println("switch~1~0");    
                    }
                     
                   
                  
         } else {
             // Serial.println("Unknown Command");
         }
        delay(10);
    }


// END VOID LOOP
}


  
