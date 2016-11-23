
/* 

REMOTE PAIR: 8/9

Serial 433MHz Relay Remote V1.1
-----------------------
By Victor Winters 2016


------ HARDWARE ------

Unit Hardware:

- Adafruit Trinket Pro 5V 16MHz/Arduino NANO V3/Arduino MINI
- HS-12 433 Wireless TX/RX
- Led
- Power supply 9/12V

*/

// PINS
int relay1 = 7;
int relay2 = 8;

String str;

void setup() {
    Serial.begin(9600);
    
    pinMode(relay1, OUTPUT);
    digitalWrite(relay1, LOW);
    
    pinMode(relay2, OUTPUT);
    digitalWrite(relay2, LOW);
}


void loop() {
  
    if(Serial.available() > 0) {
        str = Serial.readStringUntil('\n');
   
      

         if (str == "1") {
                    if (digitalRead(relay1) == HIGH){
                        digitalWrite(relay1, LOW);
                        Serial.println("1~0");
                        
                    } else if (digitalRead(relay1) == LOW) {
                        digitalWrite(relay1, HIGH);
                        Serial.println("1~1");
                        
                    }    
         } else if (str == "2") {
                    if (digitalRead(relay2) == HIGH){
                        digitalWrite(relay2, LOW);
                        Serial.println("2~0");
                        
                    } else if (digitalRead(relay2) == LOW) {
                        digitalWrite(relay2, HIGH);
                        Serial.println("2~1");
                    }

        } else if (str == "status") {
                    if (digitalRead(relay1) == HIGH){
                        Serial.println("1~1");
                    } else if (digitalRead(relay1) == LOW) {
                        Serial.println("1~0");    
                    }
                     
                    if (digitalRead(relay2) == HIGH) {
                        Serial.println("2~1");
                    } else if (digitalRead(relay2) == LOW) {
                        Serial.println("2~0");
                    } 
                  
         } else {
             // Serial.println("Unknown Command for Serial Node 8/9");
         }
        delay(10);
    }


// END VOID LOOP
}


  
