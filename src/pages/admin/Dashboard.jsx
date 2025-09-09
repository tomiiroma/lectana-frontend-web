export default function Dashboard() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Dashboard Principal</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>Total Cuentos</div>
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>Total Docentes</div>
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>Total Estudiantes</div>
        <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>Total Aulas</div>
      </div>
    </div>
  );
}


