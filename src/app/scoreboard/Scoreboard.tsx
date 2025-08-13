"use client";

import { getRealtimeDatabase } from "@/lib/firebase";
import { onValue, ref, set, update } from "firebase/database";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type ScoreState = {
  home: number;
  away: number;
  lastUpdatedAt: number;
};

const DEFAULT_STATE: ScoreState = { home: 0, away: 0, lastUpdatedAt: Date.now() };

export default function Scoreboard({ gameId = "default" }: { gameId?: string }) {
  const db = useMemo(() => getRealtimeDatabase(), []);
  const gameRef = useMemo(() => ref(db, `games/${gameId}`), [db, gameId]);

  const [score, setScore] = useState<ScoreState>(DEFAULT_STATE);

  useEffect(() => {
    const unsub = onValue(gameRef, (snap) => {
      const val = snap.val() as ScoreState | null;
      if (val) setScore(val);
      else set(gameRef, DEFAULT_STATE);
    });
    return () => unsub();
  }, [gameRef]);

  const adjust = (key: "home" | "away", delta: number) => {
    const next = Math.max(0, (score[key] ?? 0) + delta);
    update(gameRef, { [key]: next, lastUpdatedAt: Date.now() });
  };

  const reset = () => set(gameRef, { ...DEFAULT_STATE, lastUpdatedAt: Date.now() });

  return (
    <div style={{ display: "grid", gap: 16, padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <TeamScore
          label="Home"
          value={score.home}
          onAdd={() => adjust("home", 1)}
          onSub={() => adjust("home", -1)}
        />
        <TeamScore
          label="Away"
          value={score.away}
          onAdd={() => adjust("away", 1)}
          onSub={() => adjust("away", -1)}
        />
      </div>
      <button onClick={reset} style={buttonStyle}>
        Reset
      </button>
      <small style={{ opacity: 0.7 }}>
        Last updated: {new Date(score.lastUpdatedAt).toLocaleString()}
      </small>
    </div>
  );
}

function TeamScore({
  label,
  value,
  onAdd,
  onSub,
}: {
  label: string;
  value: number;
  onAdd: () => void;
  onSub: () => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: 12,
        padding: 16,
        display: "grid",
        gap: 12,
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      <div style={{ fontSize: 18, opacity: 0.85 }}>{label}</div>
      <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onSub} style={buttonStyle} aria-label={`Decrease ${label} score`}>
          −
        </button>
        <button onClick={onAdd} style={buttonStyle} aria-label={`Increase ${label} score`}>
          +
        </button>
      </div>
    </div>
  );
}

const buttonStyle: CSSProperties = {
  fontSize: 18,
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid #444",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};


