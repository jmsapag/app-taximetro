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

    function calcularTotalViajes(registers) {
        return registers.length;
    }

    function calcularTotalDineroGanado(registros) {
        return registros.reduce((total, registro) => total + registro.datos_coleccion2.cost, 0);
    }

    const totalViajes = calcularTotalViajes(registers);
    const totalDineroGanado = calcularTotalDineroGanado(registers);

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
                                <br/>
                                <strong>Latitud: {alert.latitude}</strong>
                                <br/>
                                <strong>Longitud: {alert.longitude}</strong>
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
                <br/>
                {loading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div>

                        <table>
                            <thead>
                            <tr>
                                <th>Usuario ID</th>
                                <th>Viaje ID</th>
                                <th>Tiempo Inicial</th>
                                <th>Tiempo Final</th>
                                <th>Latitud Inicial</th>
                                <th>Longitud Inicial</th>
                                <th>Latitud Final</th>
                                <th>Longitud Final</th>
                                <th>Distancia</th>
                                <th>Costo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {registers.map((register) => (
                                <tr key={register.id}>
                                    <td>{register.id_user}</td>
                                    <td>{register.id_viaje}</td>
                                    <td>{new Date(register.time).toLocaleString()}</td>
                                    <td>{new Date(register.datos_coleccion2.time).toLocaleString()}</td>
                                    <td>{register.latitud}</td>
                                    <td>{register.longitude}</td>
                                    <td>{register.datos_coleccion2.latitud}</td>
                                    <td>{register.datos_coleccion2.longitude}</td>
                                    <td>{register.datos_coleccion2.distance} mts</td>
                                    <td>${register.datos_coleccion2.cost}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="total-viajes">
                            <p className="p">Total de Viajes: {totalViajes}</p>
                        </div>

                        <div className="total-dinero-ganado">
                            <p className="p">Total de Dinero Ganado: ${totalDineroGanado}</p>
                        </div>

                    </div>

                )}
            </div>

        </div>
    );
}

export default App;
