'''
To install paho-mqtt run this command in the terminal:  pip install paho-mqtt
A nice tutorial is here: https://pypi.org/project/paho-mqtt/
'''
import random
import mysql_utils
from paho.mqtt import client as mqtt_client

broker = '192.168.15.3'
port = 1884
topic = "/rescues/severity"
client_id = f'python-mqtt-{random.randint(0, 100)}'

def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        msg_string = msg.payload.decode()
        print(f"Received `{msg_string}` from `{msg.topic}` topic")
        client_id, severity, lat_lon = msg_string.split(':')
        latitude, longitude = lat_lon.split(',') 
        mysql_utils.insert_values(mysql_utils.dbconn,
                                  mysql_utils.create_sql_query(client_id, severity, latitude, longitude))

    client.subscribe(topic)
    client.on_message = on_message

def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()

run()
mysql_utils.disconnect_db(mysql_utils.dbconn)
