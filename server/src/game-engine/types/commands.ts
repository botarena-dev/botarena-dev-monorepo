export const possibleCommandsInFrame = ["nop", "left", "right"] as const;

export type PlayerCommand = (typeof possibleCommandsInFrame)[number];
