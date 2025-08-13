import Scoreboard from "./Scoreboard";

export const dynamic = "force-dynamic";

export default function ScoreboardPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Scoreboard Control</h1>
      <Scoreboard />
      <p style={{ marginTop: 16 }}>
        Viewer URL: <code>/view/default</code>
      </p>
    </div>
  );
}


