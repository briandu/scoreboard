"use client";

import { getRealtimeDatabase } from "@/lib/firebase";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { onValue, ref } from "firebase/database";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

const Root = styled(Box)({
  minHeight: "100svh",
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  gap: 16,
  padding: 24,
  textAlign: "center",
});

const Grid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
  alignItems: "stretch",
  minHeight: 0,
});

const PanelCard = styled(Box)({
  borderRadius: "10rem",
  padding: 24,
  color: "#fff",
  display: "grid",
  placeItems: "center",
  height: "100%",
  minWidth: 0,
});

const BigScore = styled(Typography)({
  fontSize: "clamp(6rem, 18vw, 20rem)",
  fontWeight: 800,
  lineHeight: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontVariantNumeric: "tabular-nums",
});

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
    <Root>
      <Typography component="h1" sx={{ fontSize: 28, m: 0 }}>Scoreboard</Typography>
      <Grid>
        <Panel label="Home" value={score.home} />
        <Panel label="Away" value={score.away} />
      </Grid>
      <Typography component="small" sx={{ opacity: 0.7 }}>Game: {gameId}</Typography>
    </Root>
  );
}

function Panel({ label, value }) {
  return (
    <PanelCard sx={{ background: label === "Home" ? "#FF7E76" : "#91CAFF" }}>
      <BigScore component="div">{value}</BigScore>
    </PanelCard>
  );
}


