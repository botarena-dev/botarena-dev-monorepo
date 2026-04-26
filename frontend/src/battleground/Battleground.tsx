import { useCallback, useRef, useState } from "react";

const WIDTH = 400;
const HEIGHT = 200;
const TOTAL_CELLS = WIDTH * HEIGHT;

// Value → RGBA colour
const CELL_COLORS: Record<number, [number, number, number]> = {
  0: [255, 255, 255], // empty  → white
  1: [30, 30, 30], // wall   → near-black
  2: [220, 50, 50], // player 1 → red
  3: [50, 100, 220], // player 2 → blue
  4: [50, 200, 80], // player 3 → green
};

type Point = {
  x: number;
  y: number;
};

const OFFSETS_8: Point[] = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

const getIndex = (x: number, y: number) => y * WIDTH + x;

const inferPlayerTip = (
  grid: Uint8Array,
  playerValue: number,
): Point | null => {
  const playerCells: Point[] = [];

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (grid[getIndex(x, y)] === playerValue) {
        playerCells.push({ x, y });
      }
    }
  }

  if (playerCells.length === 0) {
    return null;
  }

  const endpoints = playerCells
    .map((cell) => {
      let sameNeighbours = 0;
      let emptyNeighbours = 0;

      for (const offset of OFFSETS_8) {
        const nx = cell.x + offset.x;
        const ny = cell.y + offset.y;
        if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) {
          continue;
        }

        const v = grid[getIndex(nx, ny)];
        if (v === playerValue) {
          sameNeighbours += 1;
        }
        if (v === 0) {
          emptyNeighbours += 1;
        }
      }

      return { ...cell, sameNeighbours, emptyNeighbours };
    })
    .filter((cell) => cell.sameNeighbours <= 1)
    .sort((a, b) => b.emptyNeighbours - a.emptyNeighbours);

  if (endpoints.length > 0) {
    return { x: endpoints[0].x, y: endpoints[0].y };
  }

  return playerCells[playerCells.length - 1];
};

const CIRCLE_RADIUS = 5;
// How many pixels behind the tip (along the trail) the circle centre sits,
// so the player's own trail line is still visible on top.
const CIRCLE_OFFSET = CIRCLE_RADIUS + 2;

const drawPlayerCircle = (
  ctx: CanvasRenderingContext2D,
  grid: Uint8Array,
  tip: Point,
  playerValue: number,
) => {
  // Determine trail direction away from the tip (points back into the trail).
  let dirX = 0;
  let dirY = 0;

  for (const offset of OFFSETS_8) {
    const nx = tip.x + offset.x;
    const ny = tip.y + offset.y;
    if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) {
      continue;
    }

    if (grid[getIndex(nx, ny)] === playerValue) {
      // Vector from neighbour toward tip = forward direction.
      // We want the circle behind the tip, so invert it.
      dirX = nx - tip.x;
      dirY = ny - tip.y;
      break;
    }
  }

  const len = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / len;
  const uy = dirY / len;

  // Place the circle centre behind the tip so the trail is drawn on top.
  const cx = tip.x;
  const cy = tip.y;

  ctx.beginPath();
  ctx.arc(cx, cy, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#facc15";
  ctx.fill();
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1;
  ctx.stroke();
};

const drawGrid = (canvas: HTMLCanvasElement, grid: Uint8Array) => {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const data = imageData.data;

  for (let i = 0; i < TOTAL_CELLS; i++) {
    const value = grid[i] ?? 0;
    const [r, g, b] = CELL_COLORS[value] ?? [255, 255, 255];
    const offset = i * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  for (const playerValue of [2, 3, 4]) {
    const tip = inferPlayerTip(grid, playerValue);
    if (!tip) {
      continue;
    }

    // drawPlayerCircle(ctx, grid, tip, playerValue);
  }
};

export const Battleground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/simulation");
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const res: { grid: Record<string, number> } = await response.json();
      const rawGrid = res.grid ?? {};
      const nextGrid = new Uint8Array(TOTAL_CELLS);

      for (let i = 0; i < TOTAL_CELLS; i++) {
        const value = Number(rawGrid[i] ?? 0);
        nextGrid[i] = value;
      }

      if (canvasRef.current) {
        drawGrid(canvasRef.current, nextGrid);
      }

      setLastFetchedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      </div>
      <button
        onClick={runSimulation}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-xl border border-cyan-200/30 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-6 font-['Orbitron'] text-sm font-bold uppercase tracking-[0.12em] text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Refreshing..." : "Run Simulation"}
      </button>
      {/* <header className="rounded-2xl border border-cyan-300/20 bg-slate-900/65 p-4 shadow-[0_0_35px_rgba(56,189,248,0.15)] backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-['Orbitron'] text-xs tracking-[0.3em] text-cyan-300">
              BOT ARENA
            </p>
            <h1 className="font-['Orbitron'] text-2xl font-extrabold uppercase tracking-[0.08em] text-white sm:text-3xl">
              Battleground Console
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Render live simulation grid on the arena canvas
            </p>
          </div>

          
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5 sm:text-sm">
          <div className="rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-slate-200">
            Resolution: {WIDTH}x{HEIGHT}
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-slate-200">
            Occupied: {occupancyPct}%
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-slate-200">
            Walls: {cellCounts[1]}
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-rose-300">
            P1: {cellCounts[2]}
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-emerald-300">
            P2/P3: {(cellCounts[3] ?? 0) + (cellCounts[4] ?? 0)}
          </div>
        </div>
      </header> */}

      {error && (
        <div className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-cyan-200/20 bg-slate-900/70 p-2 shadow-[0_0_30px_rgba(59,130,246,0.25)] backdrop-blur-md sm:p-4">
        <canvas
          ref={canvasRef}
          className="h-auto w-full rounded-xl border border-cyan-200/25 bg-white"
          width={WIDTH}
          height={HEIGHT}
        />
      </div>

      <div className="flex min-h-6 items-center justify-between px-1 text-xs text-slate-300 sm:text-sm">
        <span>Legend: 0 white, 1 wall, 2-4 players/walls</span>
        <span>
          {lastFetchedAt
            ? `Last update ${lastFetchedAt}`
            : "No simulation fetched yet"}
        </span>
      </div>
    </section>
  );
};
