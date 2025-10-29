# define RedAuto 2
# define OrangeAuto 3
# define GreenAuto 4
# define RedPed 5
# define GreenPed 6
# define GreenAuto2 7
# define OrangeAuto2 8
# define RedAuto2 9
# define GreenPed2 10
# define RedPed2 11
void setup()
{
  pinMode(RedAuto, OUTPUT);
  pinMode(OrangeAuto, OUTPUT);
  pinMode(GreenAuto, OUTPUT);
  pinMode(RedPed, OUTPUT);
  pinMode(GreenPed, OUTPUT);
  pinMode(RedAuto2, OUTPUT);
  pinMode(OrangeAuto2, OUTPUT);
  pinMode(GreenAuto2, OUTPUT);
  pinMode(RedPed2, OUTPUT);
  pinMode(GreenPed2, OUTPUT);
}

void loop()
{
  digitalWrite(RedAuto, HIGH);
  digitalWrite(GreenPed,HIGH);
  digitalWrite(GreenAuto2,HIGH);
  digitalWrite(RedPed2,HIGH);
  delay(7000);
  digitalWrite(OrangeAuto, HIGH);
  delay(1500);
  digitalWrite(GreenAuto2,LOW);
  digitalWrite(OrangeAuto2,HIGH);
  delay(3500);
  digitalWrite(OrangeAuto2,LOW);
  digitalWrite(RedAuto2,HIGH);
  digitalWrite(RedPed2,LOW);
  digitalWrite(GreenPed2,HIGH);
  digitalWrite(RedAuto, LOW);
  digitalWrite(OrangeAuto, LOW);
  digitalWrite(GreenPed,LOW);
  digitalWrite(GreenAuto, HIGH);
  digitalWrite(RedPed,HIGH);
  delay(6000);
  digitalWrite(OrangeAuto2,HIGH);
  digitalWrite(GreenAuto, LOW);
  digitalWrite(OrangeAuto, HIGH);
  delay(3500);
  digitalWrite(OrangeAuto2,LOW);
  digitalWrite(RedAuto2,LOW);
  digitalWrite(OrangeAuto, LOW);
  digitalWrite(RedPed,LOW);
  digitalWrite(GreenPed2,LOW);
  
  
}