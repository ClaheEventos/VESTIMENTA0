import { useState } from 'react';
import viteLogo from '/vite.svg';
import './App.css';
import Logo from './components/Logo';
import RegistroUniforme from './components/RegistroUniforme';

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [clave, setClave] = useState("");
  const CLAVE_CORRECTA = "1234567"; // 🔒 Cambiala si querés otra clave

  const manejarIngreso = (e) => {
    e.preventDefault();
    if (clave === CLAVE_CORRECTA) {
      setAutenticado(true);
    } else {
      alert("❌ Clave incorrecta.");
      setClave("");
    }
  };

  return (
    <div className="App">
  {!autenticado ? (
    <div className="login-container">
      <Logo />
      <form onSubmit={manejarIngreso} className="formulario">
        <h2 className="titulo">🔐 Ingreso Restringido</h2>
        <label className="label">Ingrese la clave:</label>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="boton">
          Ingresar
        </button>
      </form>
    </div>
  ) : (
    <>
      <Logo />
      <RegistroUniforme />
    </>
  )}
</div>
  );
}

export default App;