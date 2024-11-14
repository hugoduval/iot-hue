#include <Arduino.h>

typedef struct {
    int RED;
    int GREEN;
    int BLUE;
} tRGB;

tRGB setupPins(int rPin, int gPin, int bPin);
void setLightColor(tRGB *pins, tRGB color);
void turnOffLight(tRGB *pins);
