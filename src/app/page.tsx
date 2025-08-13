import Link from "next/link";

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Scoreboard</h1>
      <p style={{ marginBottom: 16 }}>
        Use the control page to change scores. The viewer updates live.
      </p>
      <ul style={{ display: "grid", gap: 8 }}>
        <li>
          <Link href="/view/default" style={{ textDecoration: "underline" }}>View scoreboard</Link>
        </li>
        <li>
          <Link href="/scoreboard" style={{ textDecoration: "underline" }}>Open control</Link>
        </li>
      </ul>
    </div>
  );
}
