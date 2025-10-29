#include <Adafruit_Sensor.h>
#include "thingProperties.h"
#include <Wire.h>
#include <Adafruit_BME280.h>

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme; // I2C

void setup() {
  Serial.begin(9600);
  Serial.println(F("BME280 test"));

  bool status;

  // Defined in thingProperties.h
  initProperties();

  // Connect to Arduino IoT Cloud
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  
  status = bme.begin(0x76);
  if(!status) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while(1);
  }

  Serial.println("-- Default Test -- ");

  Serial.println();
  
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();
}

void loop() {
  ArduinoCloud.update();
  printValues();
  delay(1000);
}

 void printValues(){
    Serial.print("Temperature = ");
    Serial.print(bme.readTemperature());
    Serial.println(" *C");

    Serial.print("Pressure = ");
    Serial.print(bme.readPressure() / 100.0F);
    Serial.println(" hPa");

    Serial.print("Approx. Altitude = ");
    Serial.print(bme.readAltitude(SEALEVELPRESSURE_HPA));
    Serial.println(" m");

    Serial.print("Humidity = ");
    Serial.print(bme.readHumidity());
    Serial.println(" %");

    Serial.println();
  }

