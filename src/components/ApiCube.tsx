import { useEffect, useState } from "react";

const FACES = ["REST", "WS", "AI", "Pay", "Map", "Bot"];
// Map each face index to a rotation that brings it to the front
const ROTATIONS = [
  { x: -15, y: 0 },     // front  → REST
  { x: -15, y: -180 },  // back   → WS
  { x: -15, y: -90 },   // right  → AI
  { x: -15, y: 90 },    // left   → Pay
  { x: -105, y: 0 },    // top    → Map
  { x: 75, y: 0 },      // bottom → Bot
];

export function ApiCube() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % ROTATIONS.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const r = ROTATIONS[idx];
  return (
    <div className="api-cube-wrap" aria-hidden data-api-cube>
      <div
        className="api-cube"
        style={{ transform: `rotateX(${r.x}deg) rotateY(${r.y}deg)` }}
      >
        <span className="api-cube-face front">{FACES[0]}</span>
        <span className="api-cube-face back">{FACES[1]}</span>
        <span className="api-cube-face right">{FACES[2]}</span>
        <span className="api-cube-face left">{FACES[3]}</span>
        <span className="api-cube-face top">{FACES[4]}</span>
        <span className="api-cube-face bottom">{FACES[5]}</span>
      </div>
    </div>
  );
}
