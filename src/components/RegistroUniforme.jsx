import { useState } from "react";

function RegistroUniforme() {
  const salones = [
    "Varela", "Varela II", "Berazategui", "Monteverde", "París",
    "Dream's", "Melody", "Luxor", "Bernal", "Sol Fest",
    "Clahe", "Onix", "Auguri", "Dominico II", "Gala", "Sarandí II",
    "Garufa", "Lomas", "Temperley", "Clahe Escalada"
  ];

  const [numeroResponsable, setNumeroResponsable] = useState(""); // ✅ nuevo
  const [vendedor, setVendedor] = useState("");
  const [dni, setDni] = useState("");
  const [salon, setSalon] = useState(salones[0]);
  const [uniforme, setUniforme] = useState("sí");
  const [observacion, setObservacion] = useState("");
  const [registros, setRegistros] = useState([]);
  const [registroExpandido, setRegistroExpandido] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const agregarRegistro = () => {
    if (dni.length !== 8) {
      alert("⚠️ El DNI debe tener exactamente 8 dígitos.");
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-AR");
    const hora = ahora.toLocaleTimeString("es-AR");

    const nuevo = {
      numeroResponsable,
      vendedor,
      dni,
      salon,
      uniforme,
      observacion,
      fecha,
      hora
    };

    setRegistros([...registros, nuevo]);

    setVendedor("");
    setDni("");
    setUniforme("sí");
    setObservacion("");
  };

  const enviarTodosAGoogleSheets = async () => {
    setEnviado(true);
    const url = "https://script.google.com/macros/s/AKfycbxQ7vAGtR32lt8CADqkEV5qOWP9Uq4SDu3Hs0zBlKrRaDS3YbVgvxovXhibeU8wh38u2w/exec";

    try {
      for (const registro of registros) {
        const formData = new URLSearchParams(registro);

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        });

        const data = await res.json();
        console.log("✅ Enviado:", data);
      }

      alert("✅ Todos los registros fueron enviados correctamente.");
      setRegistros([]);
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      alert("❌ Error al enviar. Revisá la consola.");
      setEnviado(false);
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
          <label className="label">Número del Responsable:</label>
          <input
            type="text"
            value={numeroResponsable}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              setNumeroResponsable(soloNumeros);
            }}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Nombre del Vendedor:</label>
          <input
            type="text"
            value={vendedor}
            onChange={(e) => {
              const soloLetras = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
              setVendedor(soloLetras);
            }}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">DNI del Vendedor:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              if (soloNumeros.length <= 8) setDni(soloNumeros);
            }}
            maxLength={8}
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
                      <p><strong>DNI:</strong> {registros[registroExpandido].dni}</p>
                      <p><strong>Salón:</strong> {registros[registroExpandido].salon}</p>
                      <p><strong>Uniforme:</strong> {registros[registroExpandido].uniforme}</p>
                      <p><strong>Observación:</strong> {registros[registroExpandido].observacion}</p>
                      <p><strong>Fecha:</strong> {registros[registroExpandido].fecha}</p>
                      <p><strong>Hora:</strong> {registros[registroExpandido].hora}</p>
                      <p><strong>Responsable de la planilla:</strong> {registros[registroExpandido].numeroResponsable}</p>

                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            {!enviado ? (
              <button onClick={enviarTodosAGoogleSheets} className="boton">
                Enviar Todo
              </button>
            ) : (
              <div className="mensaje-gracias">
                <h3>✅ ¡Gracias por enviar los registros!</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroUniforme;