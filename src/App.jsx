import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import Logo from './components/Logo'; // Mostrará logo.png desde public/
import RegistroUniforme from './components/RegistroUniforme';

function App() {
  return (
    <div className="App">
      <Logo /> {/* Mostrar el logo arriba */}
      <RegistroUniforme /> {/* Mostrar el formulario debajo */}
    </div>
  );
}

export default App;