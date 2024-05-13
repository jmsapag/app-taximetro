import React, { useEffect, useState } from "react";
import './App.css';
import icono from './assets/car.png';

function App() {

    const [registers, setRegisters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            <br/>

            <div className="registers">
                <h2>Historial de Registros</h2>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && (
                    <ul>
                        {registers.map((register, index) => (
                            <li key={index}>{register}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;
