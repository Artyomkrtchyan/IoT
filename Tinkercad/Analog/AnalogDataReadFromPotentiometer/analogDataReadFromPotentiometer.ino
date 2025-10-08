#define meter_pin A0
void setup()
 {
  Serial.begin(9600);
 }

void loop()
 {
  int sensorValue = analogRead(meter_pin);
  Serial.println(sensorValue);
  delay(1);
 }
}