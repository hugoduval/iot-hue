# iot-hue

Light levels and temperature monitoring, powered by ESP-32

## Hardware

- ESP-32
- Photoresistor (10k)
- Thermistor (10k)

## Software

- Frontend: React, accessible at `http://89.58.12.151:3003`
- Backend: Node.js (Express TypeScript)
- Database: MySQL
- MQTT Broker: Mosquitto
- Data Runner: Python 3.12

## Setup

- Plug the ESP-32 into a power source
- When the red LED turns off, you can access the ESP access point (SSID: `ESP32-AP`)
- Connect to the access point, open the captive portal and enter your WiFi credentials
- The ESP-32 will now connect to your WiFi network
- As soon as the ESP-32 is connected to the network, it will start sending data to the backend
- The frontend will now display the data in real-time

## Data

The ESP-32 sends data to the backend every 2 seconds. The data is sent in the following format:

```json
{
  "temperature": 25.0,
  "light": 1000
}
```

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details
```
