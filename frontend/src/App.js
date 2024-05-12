import './App.css';
import {useNavigate, Routes, Route, Navigate} from "react-router-dom";
import Home from "./Component/Home";
import MQTTComponent from "./Component/MQTTComponent";

function App() {

  return (
      <Routes>

        <Route path="/home" element={<Home/>}/>
        <Route path="/mqtt" element={<MQTTComponent/>}/>

      </Routes>
  );
}

export default App;
