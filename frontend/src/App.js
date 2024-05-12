import React, {useEffect, useState} from "react";
import './App.css';

function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect( () => {
    fetch("/api").then(
        response => response.json()
    ).then(
        data => { setBackendData(data) }
    )
  }, [])


  return (
    <div className="App">

      { (typeof backendData.users === 'undefined') ? (
          <p>Loading...</p>
      ): (
          backendData.users.map( (user, i) => (
              <p key={i} className="registers">{user}</p>
          ))
      )}

    </div>
  );
}

export default App;
