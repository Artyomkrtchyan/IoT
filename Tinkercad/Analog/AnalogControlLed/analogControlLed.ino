#define led_pin A1

int brightness = 0;
int step = 5;

void setup() {
  Serial.begin(9600);
  Serial.println("Starting the program");
  delay(2000);
  pinMode(led_pin, OUTPUT);
}

void loop() {
  analogWrite(led_pin,brightness);
  brightness = brightness + step;
  if (brightness <= 0 || brightness >= 255){
    step = -step;
  }
  delay(30);
  
}