const int buttonPin = 11;   
const int ledPin = 6;    

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);  
  pinMode(ledPin, OUTPUT);           
}

void loop() {
  int buttonState = digitalRead(buttonPin);

  if (buttonState == LOW) {  
    digitalWrite(ledPin, HIGH); 
  } else {
    digitalWrite(ledPin, LOW);
  }
}
