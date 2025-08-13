"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRealtimeDatabase } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";

export const dynamic = "force-dynamic";

export default function Viewer() {
  const params = useParams();
  const gameId = (params && params.gameId) || "default";
  const db = useMemo(() => getRealtimeDatabase(), []);
  const gameRef = useMemo(() => ref(db, `games/${gameId}`), [db, gameId]);

  const [score, setScore] = useState({ home: 0, away: 0, lastUpdatedAt: Date.now() });

  useEffect(() => {
    const unsub = onValue(gameRef, (snap) => {
      const val = snap.val();
      if (val) setScore(val);
    });
    return () => unsub();
  }, [gameRef]);

  return (
    <div style={{ display: "grid", gap: 24, padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 28 }}>Scoreboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Panel label="Home" value={score.home} />
        <Panel label="Away" value={score.away} />
      </div>
      <small style={{ opacity: 0.7 }}>Game: {gameId}</small>
    </div>
  );
}

function Panel({ label, value }) {
  return (
    <div style={{
      border: "1px solid #444",
      borderRadius: 12,
      padding: 24,
    }}>
      <div style={{ fontSize: 18, opacity: 0.85 }}>{label}</div>
      <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>{value}</div>
    </div>
  );
}


