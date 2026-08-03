import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Paleta visual consistente con el resto de la app
const colors = {
  bg: "#07111d",
  card: "#111b2b",
  input: "rgba(255, 255, 255, 0.04)",
  inputFocus: "rgba(255, 255, 255, 0.07)",
  accent: "#5eead4",
  accentHover: "#86f5e6",
  title: "#e5eef9",
  subtitle: "#8da0b8",
  label: "#cbd5e1",
  placeholder: "#8da0b8",
  hint: "#84cc16",
  errorBg: "rgba(255, 107, 107, 0.12)",
  errorText: "#ffb4b4",
};

// Tipos de documento soportados y sus restricciones.
// CC y CE porque el formulario original los pedía; se agregó PA (Pasaporte)
// para cubrir usuarios extranjeros de paso (turistas, por ejemplo) que
// compran en la farmacia pero no tienen cédula de extranjería colombiana.
const docTypes = [
  {
    value: "CC",
    label: "Cédula de ciudadanía",
    pattern: /^[0-9]{6,10}$/,
    hint: "Solo números · entre 6 y 10 dígitos",
    placeholder: "1234567890",
    inputMode: "numeric",
  },
  {
    value: "CE",
    label: "Cédula de extranjería",
    pattern: /^[0-9]{6,9}$/,
    hint: "Solo números · entre 6 y 9 dígitos",
    placeholder: "1234567",
    inputMode: "numeric",
  },
  {
    value: "PA",
    label: "Pasaporte",
    pattern: /^[A-Za-z0-9]{6,9}$/,
    hint: "Letras y números · entre 6 y 9 caracteres",
    placeholder: "AB123456",
    inputMode: "text",
  },
];

const initialForm = {
  tipoDocumento: docTypes[0].value,
  documento: "",
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
};

export function RegisterForm({ action = "registro", onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  const currentDocType = docTypes.find((d) => d.value === form.tipoDocumento) || docTypes[0];

  // Misma lógica que el <script> original: si la URL trae ?error=..., se muestra el banner
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get("error");
    if (errorMsg) setError(decodeURIComponent(errorMsg));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoDocumentoChange = (e) => {
    // Al cambiar el tipo, se limpia el documento para evitar que quede
    // un valor válido para un tipo pero inválido para el nuevo
    setForm((prev) => ({ ...prev, tipoDocumento: e.target.value, documento: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!currentDocType.pattern.test(form.documento)) {
      setError(`${currentDocType.label}: ${currentDocType.hint.toLowerCase()}`);
      return;
    }
    if (!/^[0-9]+$/.test(form.telefono)) {
      setError("El teléfono debe contener solo números");
      return;
    }

    if (onSubmit) {
      onSubmit(form);
    } else {
      // Comportamiento por defecto: enviar como el <form action="registro" method="POST"> original
      fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form).toString(),
      }).catch(() => setError("No se pudo conectar con el servidor"));
    }
  };

  const fieldStyle = (field) => ({
    width: "100%",
    padding: "14px 16px",
    background: focusField === field ? colors.inputFocus : colors.input,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#e5eef9",
    outline: "none",
    fontFamily: "inherit",
    appearance: "none",
  });

  const otherFields = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Nombre" },
    { name: "apellido", label: "Apellido", type: "text", placeholder: "Apellido" },
    { name: "correo", label: "Correo electrónico", type: "email", placeholder: "correo@gmail.com" },
    { name: "telefono", label: "Teléfono de contacto", type: "tel", placeholder: "3001234567", inputMode: "numeric" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at top, rgba(94, 234, 212, 0.16), transparent 36%), ${colors.bg}`,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px", background: colors.card, borderRadius: "24px", padding: "40px 34px", border: "1px solid rgba(148, 163, 184, 0.18)", boxShadow: "0 16px 36px rgba(2, 6, 23, 0.35)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: colors.title, letterSpacing: "-0.5px" }}>SGF</h1>
          <p style={{ fontSize: "14px", color: colors.subtitle, marginTop: "6px" }}>Registro de usuarios</p>
        </div>

        {error && (
          <div
            style={{
              background: colors.errorBg,
              color: colors.errorText,
              fontSize: "13px",
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="tipoDocumento" style={{ display: "block", fontSize: "12px", color: colors.label, marginBottom: "6px" }}>
              Tipo de documento
            </label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              value={form.tipoDocumento}
              onChange={handleTipoDocumentoChange}
              onFocus={() => setFocusField("tipoDocumento")}
              onBlur={() => setFocusField(null)}
              style={fieldStyle("tipoDocumento")}
            >
              {docTypes.map((d) => (
                <option key={d.value} value={d.value} style={{ background: colors.input }}>
                  {d.value} · {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="documento" style={{ display: "block", fontSize: "12px", color: colors.label, marginBottom: "6px" }}>
              Número de documento
            </label>
            <input
              id="documento"
              name="documento"
              type="text"
              inputMode={currentDocType.inputMode}
              placeholder={currentDocType.placeholder}
              value={form.documento}
              onChange={handleChange}
              onFocus={() => setFocusField("documento")}
              onBlur={() => setFocusField(null)}
              style={fieldStyle("documento")}
              required
            />
            {/* Restricción visible en tiempo real según el tipo seleccionado */}
            <p style={{ fontSize: "11px", color: colors.hint, marginTop: "6px" }}>{currentDocType.hint}</p>
          </div>

          {otherFields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} style={{ display: "block", fontSize: "12px", color: colors.label, marginBottom: "6px" }}>
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                inputMode={f.inputMode}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
                onFocus={() => setFocusField(f.name)}
                onBlur={() => setFocusField(null)}
                style={fieldStyle(f.name)}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              display: "block",
              width: "100%",
              padding: "14px 24px",
              marginTop: "8px",
              background: colors.accent,
              color: "#07111d",
              fontSize: "15px",
              fontWeight: 700,
              textAlign: "center",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = colors.accentHover)}
            onMouseOut={(e) => (e.currentTarget.style.background = colors.accent)}
          >
            Registrar usuario
          </button>
        </form>

        <a
          href="consultar"
          style={{ display: "block", textAlign: "center", fontSize: "14px", color: colors.label, textDecoration: "none", marginTop: "20px" }}
        >
          Ver usuarios registrados
        </a>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "14px 24px",
            marginTop: "12px",
            background: "transparent",
            color: colors.label,
            fontSize: "15px",
            fontWeight: 600,
            border: `1px solid rgba(148, 163, 184, 0.18)`,
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          ¿Ya tiene una cuenta? Iniciar sesión
        </button>
      </div>
    </div>
  );
}