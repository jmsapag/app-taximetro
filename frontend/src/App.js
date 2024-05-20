import React, { useEffect, useState } from "react";
import './App.css';
import icono from './assets/car.png';
import useWebSocket from 'react-use-websocket';


function App() {
    const [registers, setRegisters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [alerts, setAlerts] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8080');

    useEffect(() => {
        fetch("/registers")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los registros");
                }
                return response.json();
            })
            .then((data) => {
                setRegisters(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

/*    useEffect(() => {
        if (lastMessage !== null) {
            const alertData = JSON.parse(lastMessage.data);
            setAlerts(prevAlerts => [...prevAlerts, alertData]);
        }
    }, [lastMessage]);*/

    useEffect(() => {
        if (lastMessage !== null) {
            const alertData = JSON.parse(lastMessage.data);

            setAlerts(prevAlerts => {
                const alertExists = prevAlerts.some(alert => alert.id === alertData.id);
                const updatedAlerts = prevAlerts.filter(alert => alert.id !== alertData.id);

                if (!alertExists) {
                    return [...updatedAlerts, alertData];
                }
                return updatedAlerts;
            });
        }
    }, [lastMessage]);

    return (
        <div>
            <div className="header">
                <div className="icono-titulo">
                    <div className="icono-app">
                        <img src={icono} alt="Icono de la aplicación" width={70}/>
                    </div>
                    <div className="titulo">
                        <h1>CityHopper</h1>
                    </div>
                </div>
            </div>

            {/* Mostrar alertas de emergencia */}
            <div>
                {alerts.length > 0 ? (
                    <div className="emergency">
                        <h2>Alertas de Emergencia</h2>
                        <hr/>
                        {alerts.map((alert, index) => (
                            <div key={index}>
                                <strong>Usuario ID: {alert.id}</strong>
                                <br/>
                                <strong>Mensaje: {alert.message}</strong>
                                <hr/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p></p>
                )}
            </div>

            <br/>

            {/* Mostrar todos los registros */}
            <div className="registers">
                <h2>Historial de Registros</h2>
                <hr/>
                {loading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div>
                        {registers.map((register) => (
                            <div key={register.id} className="reg">
                                <div>
                                    <strong>Usuario ID:</strong> {register.id_user}<br/>
                                    <strong>Viaje ID:</strong> {register.id_viaje}<br/>
                                    <strong>Tiempo:</strong> {new Date(register.time).toLocaleString()}<br/>
                                    <strong>Coordenadas:</strong> ({register.latitud}, {register.longitude})<br/>
                                    <div>
                                        <strong>Coordenadas:</strong> ({register.datos_coleccion2.latitud}, {register.datos_coleccion2.longitude})<br/>
                                        <strong>Distancia:</strong> {register.datos_coleccion2.distance} metros<br/>
                                        <strong>Costo:</strong> {register.datos_coleccion2.cost} pesos<br/>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default App;
