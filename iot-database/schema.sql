CREATE SCHEMA IF NOT EXISTS `iotdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `iotdb`;

-- Table: iot-database/iot_device
CREATE TABLE IF NOT EXISTS `iot_device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_mac` varchar(255) NOT NULL,
  `device_name` varchar(255) NOT NULL, -- WIFI SSID used for the setup
  `owner_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: iot-database/user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table: iot-database/iot_data
CREATE TABLE IF NOT EXISTS `iot_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `temperature` varchar(255) NOT NULL,
  `light` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
