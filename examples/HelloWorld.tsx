export default function HelloWorld() {
  return (
    <div
      style={{ fontFamily: "sans-serif", padding: "40px", textAlign: "center" }}
    >
      <h1 style={{ color: "#6366f1", fontSize: "48px" }}>
        Hello SJSX! 👋 (Hot Reload Works!)
      </h1>
      <p style={{ fontSize: "20px", color: "#64748b" }}>
        This is a simple JSX component rendered with SSR
      </p>
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
        }}
      >
        <h2>Features</h2>
        <p>Hot reload</p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>✅ Server-Side Rendering</li>
          <li>✅ Streaming HTML</li>
          <li>✅ Hot Reload</li>
          <li>✅ Zero Config</li>
        </ul>
      </div>
    </div>
  );
}
