import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt'; // import mqtt libraries

const MQTTComponent = () => {

    const [mqttClient, setMqttClient] = useState(null);
    const [mqttData, setMqttData] = useState([]);

    // why do we create and delete the client? to establish a secure connection

    useEffect(() => {

        // create a client and connect it to the broker
        const client = mqtt.connect('mqtt://broker.example.com');

        // handles the connection
        client.on('connect', () => {
            console.log('MQTT client connected');
            // subscribe to the topics
            client.subscribe('topic1');
            client.subscribe('topic2');
        });

        // handles the messages from the subscribed topics
        client.on('message', (topic, message) => {
            // saves the data
            setMqttData(prevData => [...prevData, { topic, message: message.toString() }]);
        });

        // saves the client
        setMqttClient(client);

        // clean up
        return () => {
            if (client) {
                client.end(); // end the client
            }
        };
    }, []); // executes only when the component is created

    // publish a topic
    const publishMessage = (topic, message) => {
        if (mqttClient) {
            mqttClient.publish(topic, message);
        }
    };

    return (
        <div>
            <h1>MQTT Data</h1>
            <ul>
                {mqttData.map((data, index) => (
                    <li key={index}>
                        <strong>Topic:</strong> {data.topic}, <strong>Message:</strong> {data.message}
                    </li>
                ))}
            </ul>
            <button onClick={() => publishMessage('topic3', 'Hello MQTT')}>Publicar mensaje en topic3</button>

        </div>
    );
};

export default MQTTComponent;
