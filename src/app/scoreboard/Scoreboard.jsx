"use client";

import { getRealtimeDatabase } from "@/lib/firebase";
import { onValue, ref, set, update } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_STATE = { home: 0, away: 0, lastUpdatedAt: Date.now() };

export default function Scoreboard({ gameId = "default" }) {
  const db = useMemo(() => getRealtimeDatabase(), []);
  const gameRef = useMemo(() => ref(db, `games/${gameId}`), [db, gameId]);

  const [score, setScore] = useState(DEFAULT_STATE);

  useEffect(() => {
    const unsub = onValue(gameRef, async (snap) => {
      const val = snap.val();
      if (val) {
        setScore(val);
      } else {
        try {
          await set(gameRef, DEFAULT_STATE);
        } catch (err) {
          console.error("Failed to initialize score:", err);
        }
      }
    });
    return () => unsub();
  }, [gameRef]);

  const adjust = async (key, delta) => {
    const next = Math.max(0, (score[key] ?? 0) + delta);
    try {
      await update(gameRef, { [key]: next, lastUpdatedAt: Date.now() });
    } catch (err) {
      console.error("Failed to update score:", err);
      alert("Failed to update score. Check Firebase Realtime Database rules and env variables.");
    }
  };

  const reset = async () => {
    try {
      await set(gameRef, { ...DEFAULT_STATE, lastUpdatedAt: Date.now() });
    } catch (err) {
      console.error("Failed to reset score:", err);
      alert("Failed to reset score. Check Firebase Realtime Database rules and env variables.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 16, padding: 24, gridTemplateRows: "1fr auto auto", height: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch", minHeight: 0 }}>
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

function TeamScore({ label, value, onAdd, onSub }) {
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
        background: label === "Home" ? "#FF7E76" : "#91CAFF",
        minHeight: 0,
        height: "100%",
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

const buttonStyle = {
  fontSize: 18,
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid #444",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};


