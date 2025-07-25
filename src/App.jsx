import { useState } from 'react';
import './App.css';
import logo from './assets/images/logo/logo.png';
import RegistroUniforme from './components/RegistroUniforme';
import fondo from './assets/images/fondo.jpg'; // ✅ import directo del fondo

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [clave, setClave] = useState('');
  const CLAVE_CORRECTA = '9413949';

  const manejarIngreso = (e) => {
    e.preventDefault();
    if (clave === CLAVE_CORRECTA) {
      setAutenticado(true);
    } else {
      alert('❌ Clave incorrecta.');
      setClave('');
    }
  };

  const Logo = () => (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
    </div>
  );

  return (
    <div className="App">
      {!autenticado ? (
        <div className="div-especial">
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
        </div>
      ) : (
        <>
          <Logo />
          {/* ⬇️ Pasamos la imagen como prop */}
          <RegistroUniforme fondo={fondo} />
        </>
      )}
    </div>
  );
}

export default App;