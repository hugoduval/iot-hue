typedef struct {
    int lowLightThreshold;
    int normalLightThreshold;
    int highLightThreshold;
} tLightSensorCalibration;

void calibrateLightSensor(tLightSensorCalibration *calibration, int lightSensorPin);
int getMinSensorValueOverTime(int analogSensorPin, int time);
int getMaxSensorValueOverTime(int analogSensorPin, int time);
