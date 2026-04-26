export class Player {
  angle: number;
  id: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  dead: boolean = false;

  collisionDetected = (frameCount: number) => {
    console.log(
      `collision detected player: ${this.id}, frame: ${frameCount}, x: ${this.x}, y: ${this.y}`,
    );

    this.dead = true;
  };

  constructor(id: number) {
    this.id = id;
    this.angle = Math.random() * 360;
    this.x = Math.random() * Battleground.WIDTH;
    this.y = Math.random() * Battleground.HEIGHT;
    this.prevX = this.x;
    this.prevY = this.y;
  }
}

export class Battleground {
  static TICKRATE = 1; //units per tick
  static WIDTH = 400;
  static HEIGHT = 200;
  static TURN_SPEED = 2;

  grid = new Int8Array(Battleground.WIDTH * Battleground.HEIGHT);

  winner: Player | null = null;

  frameCount: number = 0;

  players: Player[];

  pixelIndex = (x: number, y: number) => {
    return Math.floor(y) * Battleground.WIDTH + Math.floor(x);
  };

  static BRUSH_RADIUS = 1;

  paintBrush = (cx: number, cy: number, value: number) => {
    const r = Battleground.BRUSH_RADIUS;
    const r2 = r * r;

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r2) continue;

        const px = Math.floor(cx) + dx;
        const py = Math.floor(cy) + dy;

        if (
          px < 0 ||
          px >= Battleground.WIDTH ||
          py < 0 ||
          py >= Battleground.HEIGHT
        )
          continue;

        this.grid[this.pixelIndex(px, py)] = value;
      }
    }
  };

  markLine = (player: Player) => {
    const { x: x1, y: y1, prevX: x0, prevY: y0, id } = player;
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0));

    for (let i = 0; i < steps; i++) {
      const t = steps === 0 ? 0 : i / steps;

      const ix = x0 + (x1 - x0) * t;
      const iy = y0 + (y1 - y0) * t;

      //this.paintBrush(ix, iy, 50 + 1 + id);
      this.grid[this.pixelIndex(ix, iy)] = 1 + id;
    }
  };

  battle() {
    while (this.winner === null) {
      this.tick();
    }
  }

  tick() {
    // // Player 1 movement...
    // if (this.frameCount > 120 && this.frameCount < 240) {
    //   this.players[0].angle += 0.01;
    // }

    if (this.frameCount > 10 && this.frameCount < 200) {
      this.players[0].angle += 1.87 / this.frameCount;
    }
    if (this.frameCount > 100 && this.frameCount < 400) {
      this.players[0].angle += (2 * 3.14159 - 2.3) / 300;
    }
    if (this.frameCount > 400 && this.frameCount < 700) {
      this.players[0].angle += (2 * 3.14159 - 2.3) / 300;
    }

    this.players.forEach((player) => {
      if (!player.dead) {
        player.prevX = player.x;
        player.prevY = player.y;

        // move at exactly TICKRATE units per turn;
        player.x += Math.cos(player.angle) * Battleground.TICKRATE;
        player.y += Math.sin(player.angle) * Battleground.TICKRATE;

        // wall collision
        if (
          player.x < 0 ||
          player.x > Battleground.WIDTH ||
          player.y < 0 ||
          player.y > Battleground.HEIGHT
        ) {
          player.collisionDetected(this.frameCount);
          return;
        }

        // self collision — check before marking
        if (
          this.grid[this.pixelIndex(player.x, player.y)] > 0 &&
          this.grid[this.pixelIndex(player.x, player.y)] < 20
        ) {
          player.collisionDetected(this.frameCount);
          return;
        }

        this.markLine(player);
      }
    });

    const alive = this.players.filter((player) => !player.dead);

    if (alive.length === 0) {
      // In the same frame the no1 is alive, we have a draw
      //throw new Error("DRAW");
      return { frameCount: this.frameCount, players: this.players };
    }

    if (this.players.filter((player) => !player.dead).length === 1) {
      this.winner =
        this.players[this.players.findIndex((player) => !player.dead)];

      console.log("We have a winner" + this.winner.id);
    }

    this.frameCount++;

    return { frameCount: this.frameCount, players: this.players };
  }

  constructor(players: number[]) {
    this.players = players.map((player) => new Player(player));

    this.battle();
  }
}
