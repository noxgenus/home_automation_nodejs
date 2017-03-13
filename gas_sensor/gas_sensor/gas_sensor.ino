int led = 4;
int sensorPin = A0;
int gaslevel;
int serialValue = 9600;
 
void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);
}

 
void loop() {

  gaslevel = (analogRead(sensorPin));
  gaslevel = map(gaslevel,0,1023,0,255);
 
  //Serial.println(gaslevel);
 
  if(gaslevel >= 10){
    Serial.println("gas~1");
    digitalWrite(led, HIGH);
  } else if(gaslevel < 10 && gaslevel >= 1 ){
    Serial.println("gas~0");
    digitalWrite(led, LOW);
  }

  delay(5000);
}


      
