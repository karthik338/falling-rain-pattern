import React, { useEffect, useState, useRef } from "react";


const Grid = ({ rows, cols }) => {
  const [grid, setGrid] = useState(Array(rows * cols).fill("#111"));
  const [drops, setDrops] = useState([]);
  const [currentColor, setCurrentColor] = useState(getRandomColor());
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const colorStep = useRef(0);

  const backgroundUrl = ""; // Ensure this image exists in the public folder

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];

        drops.forEach((drop) => {
          for (let i = 0; i < rows; i++) {
            const idx = i * cols + drop.col;
            newGrid[idx] = "#111";
          }
        });

        const updatedDrops = drops
          .map((drop) => {
            const newRow = drop.row + 1;
            return newRow < rows ? { ...drop, row: newRow } : null;
          })
          .filter(Boolean);

        updatedDrops.forEach((drop) => {
          for (let i = 0; i < 5; i++) {
            const r = drop.row - i;
            if (r >= 0 && r < rows) {
              const idx = r * cols + drop.col;
              const alpha = 1 - i * 0.2;
              const hueMatch = currentColor.match(/hsl\((\d+),/);
              const hue = hueMatch ? hueMatch[1] : 280;
              newGrid[idx] = `hsla(${hue}, 100%, 60%, ${alpha})`;
            }
          }
        });

        setDrops((prevDrops) => {
          let newDrops = [...updatedDrops];
          const occupiedCols = new Set(newDrops.map((d) => d.col));
          for (let i = 0; i < cols; i++) {
            if (!occupiedCols.has(i) && Math.random() < 0.05) {
              newDrops.push({ col: i, row: 0 });
              setScore((prev) => prev + 1);
            }
          }
          return newDrops;
        });

        colorStep.current += 1;
        if (colorStep.current >= 20) {
          colorStep.current = 0;
          setCurrentColor(getRandomColor());
        }

        return newGrid;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [running, drops, rows, cols, currentColor, speed]);

  const handleSpeedChange = (mode) => {
    if (mode === "slow") setSpeed(200);
    else if (mode === "medium") setSpeed(100);
    else if (mode === "fast") setSpeed(50);
  };

  return (
    <div style={{ ...outerWrapperStyle(backgroundUrl) }}>
      <div style={overlayStyle} />

      <div style={buttonPanelStyle}>
        <button
          style={{ ...buttonStyle, backgroundColor: running ? "#444" : "#9b59b6" }}
          onClick={() => setRunning(true)}
          disabled={running}
        >
          ▶ Start
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: !running ? "#444" : "#3498db" }}
          onClick={() => setRunning(false)}
          disabled={!running}
        >
          ⏸ Stop
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}
          onClick={() => setScore(0)}
        >
          🔄 Reset Score
        </button>
      </div>

      <div style={speedButtonsWrapperStyle}>
        {["slow", "medium", "fast"].map((mode) => (
          <button
            key={mode}
            style={{
              ...buttonStyle,
              backgroundColor:
                (speed === (mode === "slow" ? 200 : mode === "medium" ? 100 : 50))
                  ? "#2ecc71"
                  : "#666",
              transition: "transform 0.2s",
            }}
            onClick={() => handleSpeedChange(mode)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {mode === "slow" ? "🐢 Slow" : mode === "medium" ? "⚙ Medium" : "⚡ Fast"}
          </button>
        ))}
      </div>

      <div style={scoreStyle}>🌧️ Score: {score}</div>

      <div style={{ position: "relative", width: cols * 27, height: rows * 27 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: "url('https://www.transparenttextures.com/patterns/static-noise.png')",
            opacity: 0.05,
            zIndex: 0,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 25px)`,
            gridTemplateRows: `repeat(${rows}, 25px)`,
            gap: "2px",
            backgroundColor: "#222",
            position: "relative",
            zIndex: 1,
            border: "2px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        >
          {grid.map((color, i) => (
            <div
              key={i}
              style={{
                width: "25px",
                height: "25px",
                backgroundColor: color,
                transition: "background-color 0.1s linear",
                borderRadius: "3px",
                boxShadow: color !== "#111" ? `0 0 8px 2px ${color}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function getRandomColor() {
  const hues = [280, 300, 240, 200];
  const hue = hues[Math.floor(Math.random() * hues.length)];
  return `hsl(${hue}, 100%, 60%)`;
}

// Dynamic wrapper style using the background image
const outerWrapperStyle = (backgroundUrl) => ({
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontFamily: "'Orbitron', sans-serif",
  backgroundImage: `url(${backgroundUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
});

const overlayStyle = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 0,
};

const buttonPanelStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginBottom: "10px",
  flexWrap: "wrap",
  zIndex: 1,
};

const speedButtonsWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "15px",
  zIndex: 1,
};

const buttonStyle = {
  border: "none",
  color: "#fff",
  padding: "10px 15px",
  fontSize: "1rem",
  borderRadius: "8px",
  cursor: "pointer",
  boxShadow: "0 0 8px #8e44ad88",
  transition: "all 0.2s ease-in-out",
  fontFamily: "'Orbitron', sans-serif",
};

const scoreStyle = {
  textAlign: "center",
  color: "#fff",
  fontSize: "1.2rem",
  fontFamily: "'Orbitron', sans-serif",
  marginBottom: "10px",
  zIndex: 1,
};

export default Grid;
