#include <Adafruit_DotStar.h>
#include <SPI.h>
#define NUMPIXELS 10
#define DATAPIN    3
#define CLOCKPIN   4
Adafruit_DotStar strip = Adafruit_DotStar(NUMPIXELS, DATAPIN, CLOCKPIN, DOTSTAR_BGR);

int framerate = 100; 
int incomingAudio;

uint32_t colorred = 0xb40101;
uint32_t colorreddark = 0xff0000;
uint32_t colorreddarker = 0x090000;
uint32_t off = 0x000000;

void setup() {

  Serial.begin(9600);
  
    // Dotstar stuff, remove if not needed
    #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000L)
    clock_prescale_set(clock_div_1); // Enable 16 MHz on Trinket
    #endif
    strip.begin();
            strip.setPixelColor(0, colorreddark);
            strip.setPixelColor(1, colorreddark);
            strip.setPixelColor(2, colorreddark);
            strip.setPixelColor(3, colorreddark);
            strip.setPixelColor(4, colorreddark);
            strip.setPixelColor(5, colorreddark);
            strip.setPixelColor(6, colorreddark);
            strip.setPixelColor(7, colorreddark);
            strip.setPixelColor(8, colorreddark);
            strip.setPixelColor(9, colorreddark);
      strip.show(); 
      delay(2000);
            strip.setPixelColor(0, off);
            strip.setPixelColor(1, off);
            strip.setPixelColor(2, off);
            strip.setPixelColor(3, off);
            strip.setPixelColor(4, off);
            strip.setPixelColor(5, off);
            strip.setPixelColor(6, off);
            strip.setPixelColor(7, off);
            strip.setPixelColor(8, off);
            strip.setPixelColor(9, off);
      strip.show(); 


        Serial.println("booted");
    
 
}



void loop() {

  incomingAudio = analogRead(0);
  Serial.println(incomingAudio);
  
  incomingAudio = map(incomingAudio, 0, 20, 0, 5);
  //Serial.println(incomingAudio);
 

    if (incomingAudio == 0){
            strip.setPixelColor(0, off);
            strip.setPixelColor(1, off);
            strip.setPixelColor(2, off);
            strip.setPixelColor(3, off);
            strip.setPixelColor(4, off);
            strip.setPixelColor(5, off);
            strip.setPixelColor(6, off);
            strip.setPixelColor(7, off);
            strip.setPixelColor(8, off);
            strip.setPixelColor(9, off);

    } else if (incomingAudio == 1){
            strip.setPixelColor(0, off);
            strip.setPixelColor(1, off);
            strip.setPixelColor(2, off);
            strip.setPixelColor(3, off);
            strip.setPixelColor(4, colorreddark);
            strip.setPixelColor(5, colorreddark);
            strip.setPixelColor(6, off);
            strip.setPixelColor(7, off);
            strip.setPixelColor(8, off);
            strip.setPixelColor(9, off);


    } else if (incomingAudio == 2){
            strip.setPixelColor(0, off);
            strip.setPixelColor(1, off);
            strip.setPixelColor(2, off);
            strip.setPixelColor(3, colorreddark);
            strip.setPixelColor(4, colorreddark);
            strip.setPixelColor(5, colorreddark);
            strip.setPixelColor(6, colorreddark);
            strip.setPixelColor(7, off);
            strip.setPixelColor(8, off);
            strip.setPixelColor(9, off);


    } else if (incomingAudio == 3){
            strip.setPixelColor(0, off);
            strip.setPixelColor(1, off);
            strip.setPixelColor(2, colorreddark);
            strip.setPixelColor(3, colorreddark);
            strip.setPixelColor(4, colorreddark);
            strip.setPixelColor(5, colorreddark);
            strip.setPixelColor(6, colorreddark);
            strip.setPixelColor(7, colorreddark);
            strip.setPixelColor(8, off);
            strip.setPixelColor(9, off);

    } else if (incomingAudio == 4){
            strip.setPixelColor(0, colorreddark);
            strip.setPixelColor(1, colorreddark);
            strip.setPixelColor(2, colorreddark);
            strip.setPixelColor(3, colorreddark);
            strip.setPixelColor(4, colorreddark);
            strip.setPixelColor(5, colorreddark);
            strip.setPixelColor(6, colorreddark);
            strip.setPixelColor(7, colorreddark);
            strip.setPixelColor(8, colorreddark);
            strip.setPixelColor(9, colorreddark);


    } else if (incomingAudio == 5){
            strip.setPixelColor(0, colorreddark);
            strip.setPixelColor(1, colorreddark);
            strip.setPixelColor(2, colorreddark);
            strip.setPixelColor(3, colorreddark);
            strip.setPixelColor(4, colorreddark);
            strip.setPixelColor(5, colorreddark);
            strip.setPixelColor(6, colorreddark);
            strip.setPixelColor(7, colorreddark);
            strip.setPixelColor(8, colorreddark);
            strip.setPixelColor(9, colorreddark);


    }
 strip.show();
}
