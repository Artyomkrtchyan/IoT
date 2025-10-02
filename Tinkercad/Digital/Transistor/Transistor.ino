#define button 2
#define transistor 3

void setup()
{
  pinMode(button, INPUT_PULLUP);
  pinMode(transistor, OUTPUT);
}

void loop()
{
  
  int buttonState = digitalRead(button);
  if(buttonState == 0){
    digitalWrite(transistor,1);
  }
  else{
    digitalWrite(transistor,0);
  }
  
}