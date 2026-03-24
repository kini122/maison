export default function AdminSettingsPage() {
  return (
    <div style={{ maxWidth: 600 }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2rem",
          fontWeight: 400,
          marginBottom: 32,
        }}
      >
        Settings
      </h1>
      <div
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border)",
          padding: 32,
        }}
      >
        <h2
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 20,
          }}
        >
          Store Settings
        </h2>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            color: "var(--color-muted)",
            fontSize: "0.9rem",
          }}
        >
          Settings configuration coming soon. WhatsApp number, store hours, and
          other preferences will be managed here.
        </p>
      </div>
    </div>
  );
}
