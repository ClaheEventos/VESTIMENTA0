import { useState } from "react";

function RegistroUniforme() {
  const salones = [
    "Varela", "Varela II", "Berazategui", "Monteverde", "París",
    "Dream's", "Melody", "Luxor", "Bernal", "Sol Fest",
    "Clahe", "Onix", "Auguri", "Dominico II", "Gala", "Sarandí II",
    "Garufa", "Lomas", "Temperley", "Clahe Escalada"
  ];

  const [vendedor, setVendedor] = useState("");
  const [salon, setSalon] = useState(salones[0]);
  const [uniforme, setUniforme] = useState("sí");
  const [observacion, setObservacion] = useState("");
  const [registros, setRegistros] = useState([]);
  const [registroExpandido, setRegistroExpandido] = useState(null);

  const agregarRegistro = () => {
    const nuevo = { vendedor, salon, uniforme, observacion };
    setRegistros([...registros, nuevo]);

    // Limpiar inputs
    setVendedor("");
    setUniforme("sí");
    setObservacion("");
  };

  const enviarTodosAGoogleSheets = async () => {
    const url = "https://script.google.com/macros/s/AKfycbyhtLgaUg772A9uk-ABixx3ujHdQ82Pm4pcc9wh8qN6x_OPVMJ8fiGhaxqAjH2eJA5YOA/exec";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registros)
      });

      const data = await res.json();
      console.log("✅ Enviados correctamente:", data);

      alert("✅ Todos los registros fueron enviados correctamente.");
      setRegistros([]); // Vaciar después de enviar
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      alert("❌ Error al enviar. Revisá la consola.");
    }
  };

  const borrarRegistro = (index) => {
    const actualizados = registros.filter((_, i) => i !== index);
    setRegistros(actualizados);
    if (registroExpandido === index) setRegistroExpandido(null);
  };

  const toggleDetalle = (index) => {
    setRegistroExpandido(registroExpandido === index ? null : index);
  };

  return (
    <div className="contenedor">
      <h2 className="titulo">Registro de Uniformes</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          agregarRegistro();
        }}
        className="formulario"
      >
        <div>
          <label className="label">Nombre del Vendedor:</label>
          <input
            type="text"
            value={vendedor}
            onChange={(e) => setVendedor(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Salón:</label>
          <select
            value={salon}
            onChange={(e) => setSalon(e.target.value)}
            className="select"
          >
            {salones.map((nombre, i) => (
              <option key={i} value={nombre}>{nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Uniforme:</label>
          <select
            value={uniforme}
            onChange={(e) => setUniforme(e.target.value)}
            className="select"
          >
            <option value="sí">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="label">Observación:</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="textarea"
            rows="2"
          />
        </div>

        <button type="submit" className="boton">
          Agregar Registro
        </button>
      </form>

      {registros.length > 0 && (
        <div className="tabla-contenedor">
          <h3 className="titulo">Registros Acumulados</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, i) => (
                <tr key={i}>
                  <td>{r.vendedor}</td>
                  <td>
                    <button onClick={() => toggleDetalle(i)} className="boton">
                      {registroExpandido === i ? "Ocultar" : "Ver"}
                    </button>{" "}
                    <button onClick={() => borrarRegistro(i)} className="boton-borrar">
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
              {registroExpandido !== null && (
                <tr>
                  <td colSpan="2">
                    <div className="detalle-registro">
                      <p><strong>Salón:</strong> {registros[registroExpandido].salon}</p>
                      <p><strong>Uniforme:</strong> {registros[registroExpandido].uniforme}</p>
                      <p><strong>Observación:</strong> {registros[registroExpandido].observacion}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button onClick={enviarTodosAGoogleSheets} className="boton">
              Enviar Todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroUniforme;