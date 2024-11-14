#include <Arduino.h>
#include "statuslight.h"

tRGB setupPins(int rPin, int gPin, int bPin)
{
    tRGB pins;
    pins.RED = rPin;
    pins.GREEN = gPin;
    pins.BLUE = bPin;
    pinMode(pins.RED, OUTPUT);
    pinMode(pins.GREEN, OUTPUT);
    pinMode(pins.BLUE, OUTPUT);
    return pins;
}

void setLightColor(tRGB *pins, tRGB color)
{
    analogWrite(pins->RED, color.RED);
    analogWrite(pins->GREEN, color.GREEN);
    analogWrite(pins->BLUE, color.BLUE);
}

void turnOffLight(tRGB *pins)
{
    analogWrite(pins->RED, 0);
    analogWrite(pins->GREEN, 0);
    analogWrite(pins->BLUE, 0);
}
