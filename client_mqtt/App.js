/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* @flow */
import React from 'react'; 
import {Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

import {Button} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import Geolocation from '@react-native-community/geolocation';

let client; 

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '/rescues/severity',
      subscribedTopic: '/rescues/severity',
      message: '',
      messageList: [],
      status: '',
      ip: '0.tcp.sa.ngrok.io',
      port: 16960,
      severity: '',
      latitude: 0, 
      longitude: 0,
    };

    this.getOneTimeLocation(); 
    this.subscribeLocation();  

  }

  onConnectionLost = responseObject => {
    // TODO: onConnectionLost
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  };

  onMessageArrived = message => {
    // TODO: onMessageArrived
    console.log('onMessageArrived:' + message.payloadString);
    newmessageList = this.state.messageList;
    newmessageList.unshift(message.payloadString);
    this.setState({ messageList: newmessageList });
  };

  subscribeTopic = () => {
    client.subscribe(this.state.topic);
  };

  onConnect = () => {
    console.log('onConnect');
    this.setState({ status: 'connected' });
    this.timer = setInterval(this.sendMessage.bind(this), 10000); 
  };

  onFailure = () => {
    console.log('Connect failed!');
    console.log(err);
    this.setState({ status: 'failed' });
  };

  connect = () => {
    client = new Paho.MQTT.Client(
      this.state.ip,
      this.state.port,
      'mqttjs_' + Math.random().toString(16).substr(2, 8)
    );

    client.connect();

    client.onConnected = this.onConnect;
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
    client.onConnectionLost = this.onFailure;
  };

  unSubscribeTopic = () => {
    client.unsubscribe(this.state.subscribedTopic);
  };

  sendMessage = () => {
    this.state.message = `${client.clientId}:${this.state.severity}:${this.state.latitude},${this.state.longitude}`
    client.send(this.state.topic, this.state.message);
  };
  
  getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
 
        //getting the Longitude from the location json
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);
 
        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        this.state.longitude = currentLongitude;
        
        //Setting Longitude state
        this.state.latitude = currentLatitude;
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };
  
  subscribeLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
 
        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);
 
        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);
 
        //Setting Longitude state
        this.state.longitude = currentLongitude;
 
        //Setting Latitude state
        this.state.latitude = currentLatitude;
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.connectContainer}>
          <Text style={styles.label}>Broker IP:</Text>
          <TextInput
            style={styles.input}
            value={this.state.ip}
            onChangeText={event => this.setState({ip: event})}
          />
        </View>
        <View style={styles.connectContainer}>
          <Text style={styles.label}>Broker Port:</Text>
          <TextInput
            style={styles.input}
            value={this.state.port.toString()}
            onChangeText={event => this.setState({port: Number(event)})}
          />
        </View>
        {this.state.status === 'connected' ? (
          <Button
            type="solid"
            title="DISCONNECT"
            onPress={() => {
              client.disconnect();
              clearInterval(this.timer);
              this.setState({status: '', subscribedTopic: ''});
            }}
            buttonStyle={{backgroundColor: '#397af8'}}
            disabled={!this.state.ip || !this.state.port}
          />
        ) : (
          <Button
            type="solid"
            title="CONNECT"
            onPress={this.connect}
            buttonStyle={{backgroundColor: '#72F178'}}
            disabled={!this.state.ip || !this.state.port}
          />
        )}
        <View style={styles.severityContainer}>
          <Text style={styles.label}>Severity</Text>
          <View style={styles.severityButtonContainer}>
            <Button
              type="solid"
              title="Low"
              onPress={e => this.setState({severity: 'Low'})}
              buttonStyle={{backgroundColor: '#72F178', margin: 20}}
              style={styles.severityButtonContainer}
            />
            <Button
              type="solid"
              title="Medium"
              onPress={e => this.setState({severity: 'Medium'})}
              buttonStyle={{backgroundColor: '#FFF145', margin: 20}}
              style={styles.severityButtonContainer}
            />
            <Button
              type="solid"
              title="High"
              onPress={e => this.setState({severity: 'High'})}
              buttonStyle={{backgroundColor: '#E21100', margin: 20}}
              style={styles.severityButtonContainer}
            />
          </View>
        </View>
        <Button
          type="solid"
          title="UPDATE"
          onPress={this.sendMessage}
          buttonStyle={{backgroundColor: '#127676'}}
          disabled={!this.state.severity}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  connectContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    padding: 10,
    marginLeft: 40,
    height: 50,
    width: 200,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  severityContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 150,
    margin: 20,
    padding: 20,
  },
  severityButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
  },
  messageContainer: {
    margin: 20,
  },
  message: {
    padding: 10,
    height: 50,
    width: '100%',
    marginTop: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default App;
