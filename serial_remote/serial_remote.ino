
/* 

REMOTE NO 1

Serial 433MHz Relay Remote V1.0
-----------------------
By Victor Winters 2016


------ HARDWARE ------

Unit Hardware:

- Adafruit Trinket Pro 5V 16MHz/Arduino NANO V3/Arduino MINI
- HS-12 433 Wireless TX/RX
- Led
- Power supply 9/12V

*/

String readString;

// PINS
int relay1 = 7;
int relay2 = 8;


void setup() {
    Serial.begin(9600);
    
    pinMode(relay1, OUTPUT);
    digitalWrite(relay1, LOW);
    
    pinMode(relay2, OUTPUT);
    digitalWrite(relay2, LOW);
}


void loop() {

     char incomingByte;
     
     while (Serial.available()>0) {
     delay(10);
     incomingByte = Serial.read();
     readString +=incomingByte;
     }
    
   if(readString != "") {
       
    // Serial.println(readString);
     
         if (readString == "8") {
                    if (digitalRead(relay1) == HIGH){
                        digitalWrite(relay1, LOW);
                        Serial.println("8~0");
                        
                    } else if (digitalRead(relay1) == LOW) {
                        digitalWrite(relay1, HIGH);
                        Serial.println("8~1");
                        
                    }    
         } else if (readString == "9") {
                    if (digitalRead(relay2) == HIGH){
                        digitalWrite(relay2, LOW);
                        Serial.println("9~0");
                        
                    } else if (digitalRead(relay2) == LOW) {
                        digitalWrite(relay2, HIGH);
                        Serial.println("9~1");
                    }
                  
         } else {
              Serial.println("Unknown Command");
         }
   }
       
  readString = "";

/*
int x;
String str;

void loop() 
{
    if(Serial.available() > 0)
    {
        str = Serial.readStringUntil('\n');
        x = Serial.parseInt();
    }
}
*/

  }
  
