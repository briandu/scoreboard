"use client";

import { getRealtimeDatabase } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ScoreState = {
  home: number;
  away: number;
  lastUpdatedAt: number;
};

export const dynamic = "force-dynamic";

export default function Viewer() {
  const params = useParams<{ gameId: string }>();
  const gameId = params?.gameId ?? "default";
  const db = useMemo(() => getRealtimeDatabase(), []);
  const gameRef = useMemo(() => ref(db, `games/${gameId}`), [db, gameId]);

  const [score, setScore] = useState<ScoreState>({ home: 0, away: 0, lastUpdatedAt: Date.now() });

  useEffect(() => {
    const unsub = onValue(gameRef, (snap) => {
      const val = snap.val() as ScoreState | null;
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

function Panel({ label, value }: { label: string; value: number }) {
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


