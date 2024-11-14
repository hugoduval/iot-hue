#include <Arduino.h>
#include "lightsensor.h"

void calibrateLightSensor(tLightSensorCalibration *calibration, int lightSensorPin) {
    Serial.println("Calibrating light sensor...");
    Serial.println("Please cover the light sensor ...");
    sleep(2);
    calibration->lowLightThreshold = getMinSensorValueOverTime(lightSensorPin, 3000);
    Serial.println("Please uncover the light sensor ...");
    sleep(2);
    int highNormal = getMaxSensorValueOverTime(lightSensorPin, 1500);
    int lowNormal = getMinSensorValueOverTime(lightSensorPin, 1500);
    calibration->normalLightThreshold = (highNormal + lowNormal) / 2;
    Serial.println("Please shine a bright light on the sensor ...");
    sleep(2);
    calibration->highLightThreshold = getMaxSensorValueOverTime(lightSensorPin, 3000);
    Serial.println("\n___________\nCalibration complete !");
}

int getMinSensorValueOverTime(int analogSensorPin, int time) {
    int minSensorValue = 4095;
    int sensorValue = 0;
    Serial.println("Calibrating light sensor...");
    unsigned long startTime = millis();
    while (millis() - startTime < time) {
    sensorValue = analogRead(analogSensorPin);
        if (sensorValue < minSensorValue) {
            minSensorValue = sensorValue;
        }
    }
    Serial.println("Low threshold calibration complete");
    return minSensorValue;
}

int getMaxSensorValueOverTime(int analogSensorPin, int time) {
    int maxSensorValue = 0;
    int sensorValue = 0;
    Serial.println("Calibrating light sensor...");
    unsigned long startTime = millis();
    while (millis() - startTime < time) {
        sensorValue = analogRead(analogSensorPin);
        if (sensorValue > maxSensorValue) {
            maxSensorValue = sensorValue;
        }
    }
    Serial.println("High threshold calibration complete");
    return maxSensorValue;
}
