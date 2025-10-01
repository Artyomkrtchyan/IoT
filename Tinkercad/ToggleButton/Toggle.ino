# define led 2
# define button 3
int ledState = LOW;
int lastButtonState = HIGH;
void setup()
{
  pinMode(button, INPUT_PULLUP);
  pinMode(led, OUTPUT);
  digitalWrite(led,ledState);
}

void loop()
{
  int buttonState = digitalRead(button);
  if(lastButtonState == HIGH && buttonState == LOW){
    ledState = !ledState;
    digitalWrite(led, ledState);
  }
  lastButtonState = buttonState;
}