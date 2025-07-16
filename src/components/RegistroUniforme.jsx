import { useState } from "react";
import * as XLSX from "xlsx";

function RegistroUniforme() {
  const [vendedor, setVendedor] = useState("");
  const [salon, setSalon] = useState("Salón A");
  const [uniforme, setUniforme] = useState("sí");
  const [observacion, setObservacion] = useState("");
  const [registros, setRegistros] = useState([]);
  const [registroExpandido, setRegistroExpandido] = useState(null);

  const salones = [
    "Varela", "Varela II ", "Berazategui", "Monteverde", "París",
    "Dream's", "Melody", "Luxor", "Bernal", "Sol Fest",
    "Clahe", "Onix", "Auguri", "Dominico II", "Gala", "Sarandí II",
    "Garufa", "Lomas", "Temperley", "Clahe Escalada"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = { vendedor, salon, uniforme, observacion };
    setRegistros([...registros, nuevo]);

    setVendedor("");
    setUniforme("sí");
    setObservacion("");
  };

  const borrarRegistro = (index) => {
    const actualizados = registros.filter((_, i) => i !== index);
    setRegistros(actualizados);
    if (registroExpandido === index) setRegistroExpandido(null);
  };

  const exportarExcelYCompartir = async () => {
    const fechaActual = new Date().toISOString().split("T")[0];
    const nombreArchivo = `Registros_${salon}_${fechaActual}.xlsx`;

    const ws = XLSX.utils.json_to_sheet(registros);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new File([excelBuffer], nombreArchivo, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: nombreArchivo,
          text: "Registro de uniformes",
          files: [file],
        });
      } catch (error) {
        console.error("Error al compartir:", error);
        alert("No se pudo compartir el archivo.");
      }
    } else {
      // Fallback: descarga si no se puede compartir
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const toggleDetalle = (index) => {
    setRegistroExpandido(registroExpandido === index ? null : index);
  };

  return (
    <div className="contenedor">
      <h2 className="titulo">Registro de Uniformes</h2>

      <form onSubmit={handleSubmit} className="formulario">
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
          Guardar Registro
        </button>
      </form>

      {registros.length > 0 && (
        <div className="tabla-contenedor">
          <h3 className="titulo">Vista Previa de Registros</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, i) => (
                <>

                  <tr key={i}>
                    <td>{r.vendedor}</td>
                    <td>
                      <button
                        onClick={() => toggleDetalle(i)}
                        className="boton"
                      >
                        {registroExpandido === i ? "Ocultar" : "Ver"}
                      </button>{" "}
                      <button
                        onClick={() => borrarRegistro(i)}
                        className="boton-borrar"
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>

                  {registroExpandido === i && (
                    <tr>
                      <td colSpan="2">
                        <div className="detalle-registro">
                          <p><strong>Salón:</strong> {r.salon}</p>
                          <p><strong>Uniforme:</strong> {r.uniforme}</p>
                          <p><strong>Observación:</strong> {r.observacion}</p>
                        </div>
                      </td>
                    </tr>
                  )}

                </>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button onClick={exportarExcelYCompartir} className="boton">
              Compartir / Descargar Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroUniforme;