#include <Arduino.h>
#include <WiFiManager.h>
#include <PubSubClient.h>
#include "lightsensor.h"
#include "statuslight.h"

#define LIGHT_SENSOR_PIN 36
#define THERMISTOR_PIN 35
#define RESET_PIN 21
#define GREEN_LED 13
#define RED_LED 12

const char *mqtt_server = "89.58.12.151";
String clientId = "ESP32-";

WiFiClient wifiCaptivePortalClient;
PubSubClient mqttClient(wifiCaptivePortalClient);

void setup()
{
    Serial.begin(115200);
    pinMode(RESET_PIN, INPUT_PULLUP);
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(LIGHT_SENSOR_PIN, INPUT);
    pinMode(THERMISTOR_PIN, INPUT);
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, HIGH);
    clientId += "-";
    WiFiManager wifiManager;
    bool res = wifiManager.autoConnect("ESP32-AP");

    if (!res)
    {
        Serial.println("[SETUP] Failed to connect to Wifi");
        ESP.restart();
    }

    Serial.println("[SETUP] Wifi is connected");
    Serial.print("IP : ");
    Serial.println(WiFi.localIP());
    clientId += WiFi.SSID();
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
    Serial.println("[CLIENTID] " + clientId);

    // MQTT broker config
    mqttClient.setServer(mqtt_server, 1884);
}

void reconnectMQTT()
{
    while (!mqttClient.connected())
    {
        Serial.println("[MQTT] Attempting MQTT connection...");
        if (mqttClient.connect(clientId.c_str()))
        {
            Serial.println("[MQTT] Connected, ID : " + clientId);
        }
        else
        {
            Serial.printf("[MQTT] Connection failed, error state : %d\n", mqttClient.state());
            Serial.println("[MQTT] Retry in 5 seconds");
            delay(5000);
        }
    }
}

void updateMqttStatus(int lightValue, int temp)
{
    if (!mqttClient.connected())
    {
        reconnectMQTT();
    }
    String values = String(lightValue) + " " + String(temp);
    String topic = "esp32/" + clientId + "/status";
    char topic[50];
    char payload[50];
    values.toCharArray(payload, 50);
    mqttClient.publish(topic, payload);
}

void handleReset()
{
    WiFiManager wifiManager;
    wifiManager.resetSettings();
    Serial.println("[RESET] Settings reset, rebooting...");
    digitalWrite(RED_LED, HIGH);
    delay(200);
    digitalWrite(RED_LED, LOW);
    ESP.restart();
}

int convertToCelsius(int thermistorValue)
{
    float R = 10000.0 / ((4095.0 / thermistorValue) - 1);
    float T = 1 / (1 / (273.15 + 25) + (1 / 3950.0) * log(R / 10000.0));
    return T - 273.15;
}

void loop()
{
    // Read the value from the button pin
    digitalWrite(GREEN_LED, HIGH);
    int buttonState = digitalRead(RESET_PIN);
    if (buttonState == LOW)
    {
        handleReset();
    }
    int lightValue = analogRead(LIGHT_SENSOR_PIN);
    int thermistorValue = analogRead(THERMISTOR_PIN);
    int celsius = convertToCelsius(thermistorValue);
    Serial.printf("[MAIN] Light : %d, Temp : %d\n", lightValue, celsius);
    updateMqttStatus(lightValue, celsius);
    mqttClient.loop();
    delay(5000);
    digitalWrite(GREEN_LED, LOW);
}
