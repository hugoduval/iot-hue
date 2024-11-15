import paho.mqtt.client as mqtt
import mysql.connector
from mysql.connector import Error

# MySQL Database configuration
db_config_lh = {
        'host': 'localhost',  # Change to your database host
    'user': 'iot',       # Change to your database user
    'password': 'iot123',  # Change to your database password
    'database': 'iotdb'  # Change to your database name
}

db_config_docker = {
    'host': 'mysql',  # Change to your database host
    'user': 'iot',       # Change to your database user
    'password': 'iot123',
    'database': 'iotdb'  # Change to your database name
}

db_config = db_config_docker

# MQTT Configuration
BROKER_DOCKER = 'mosquitto'
BROKER_LOCALHOST = 'localhost'
MQTT_BROKER = BROKER_DOCKER  # Replace with your MQTT broker address
MQTT_PORT = 1884
MQTT_TOPIC = 'esp32/status'  # Replace with your desired topic

def connect_to_database():
    """Establish a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def write_to_database(connection, topic, message):
    """Insert the received MQTT message into the database."""
    msg = message.split(' ')
    light = msg[0]
    temp = msg[1]
    cid = msg[2]
    try:
        cursor = connection.cursor()
        query = "INSERT INTO iot_data (device_name, temperature, light) VALUES (%s, %s, %s)"
        cursor.execute(query, (cid, temp, light))
        connection.commit()
        print(f"Inserted: {message} into database")
    except Error as e:
        print(f"Error writing to database: {e}")

# MQTT Callbacks
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()} on topic: {msg.topic}")
    connection = userdata.get('db_connection')
    if connection:
        write_to_database(connection, msg.topic, msg.payload.decode())

# Main Function
def main():
    # Connect to MySQL database
    db_connection = connect_to_database()
    if not db_connection:
        return

    # Initialize MQTT client
    client = mqtt.Client(userdata={'db_connection': db_connection})
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_forever()
    except Exception as e:
        print(f"Error connecting to MQTT Broker: {e}")
    finally:
        if db_connection.is_connected():
            db_connection.close()
            print("MySQL connection closed")

if __name__ == '__main__':
    main()
