#define button 2
#define transistor 3

void setup() {
  pinMode(button, INPUT_PULLUP);
  pinMode(transistor, OUTPUT);
  digitalWrite(transistor, LOW);
}

void loop() {
  if (digitalRead(button) == LOW) {
    digitalWrite(transistor, HIGH);
    delay(300);
    digitalWrite(transistor, LOW);
    delay(300);
  } else {
    digitalWrite(transistor, LOW);
  }
}
