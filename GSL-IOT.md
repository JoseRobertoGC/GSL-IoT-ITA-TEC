# Running the virtual machine environment 

The virtual machines were created using the Virtual Box Version 6.1.16 r140961 (Qt5.6.2) application. 

## Global Virtual Machine:

Instance file: 
https://drive.google.com/file/d/19_hkMRWlLK87wkaNbLiqBMEaduJHFMWQ/view?usp=sharing

Machine credentials:
user: wifi
password: wifi 

### Mosquitto Central Broker 

Commands to start the Mosquitto central broker:

```
$ cd ~/GSL-IoT-ITA-TEC/broker_connection && \
  sudo mosquitto -c mosquitto_central.conf -v
```

Get the ip from bridge broker adapter:

```
$ hostname -I
```

** This IP address will bre necessary to configure the bridge broker. ** 

### Grafana Server 

Commands to start grafana server:

```
$ sudo systemctl start grafana-server
```

The server will start at port 3000. 

Grafana credentials:

user: admin 
password: admin@2022

### Service to store the severity in the database

Run the command to install the python dependencies if you do not have the libraries yet: 

```
sudo python -m pip install paho-mqtt mysql-connector-python
```

To start the service to store the severity occurrences into the database use the following command: 

```
$ cd ~/GSL-IoT-ITA-TEC/mqtt_subscriber && \
  sudo python mqtt_subscriber.py 
```

** Make sure to change the IP addresses and ports inside the files mqtt_subscriber.py e mysql_utils.py ** 
### MySql Instance 

Database credentials: 

user: 'root'
password: 'root@2022'
dbname:'GSL_IoT_ITA_TEC'

## Mininet Virtual Machine:

Instance File:
https://drive.google.com/file/d/14MUnQD8K1XtCQBBw43Uzx0-oZ3t-mCde/view?usp=share_link

Machine credentials:
user: wifi
password: wifi 

### Commands to start the mininet environment:

Start the mininet NAT program, using the following command: 

```
$ cd ~/mininet-wifi/mininet/examples/ && \
  sudo python nat.py
```

Inside the mininet console open two instances of host h1 (drone host simulation): 

```
mininet> xterm h1 h1
```

1° console -> Start the bridge broker to connect with the centralized broker. 

Change directory to the mosquitto config folder:

```
# cd /home/wifi/GSL-IoT-ITA-TEC/broker_connection 
```

** Modify the field in the bridge configuration file, with the IP address from the central broker obtained in the previous step: **

```
#central broker address 
address <CENTRAL BROKER IP>
```

Run the bridge broker with the command: 

```
# mosquitto -c mosquitto_bridge.conf -v
```

2° console -> Expose the bridge broker using the Ngrok application.

```
# ngrok tcp 1883
```

Note this address and port to connect the smartphone to this broker instance. 

## Android Application

### Running the App 

Start metro server: 

```
$ npm start
```

Start android emulator:

```
$ npm run android
```

### Connect to the Bridge broker 

Insert the IP address and port provided by the Ngrok application inside Mininet. 

Click connect, then choose the severity level. 

The app will constantly send the severity information chose every 10 seconds. 


