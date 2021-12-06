import { chunk } from "https://deno.land/std@0.117.0/collections/mod.ts";

const day6Input = (await Deno.readTextFile("./day6-input"))
  .split(",")
  .map(Number);

const DAYS = 256;
const CHUNK_SIZE = 1000;
const SPAWN_CYCLE = 7;
const SPOOL = 2;

const tickSpawnArray = (spawnArray: number[]) => {
  const additions = [] as number[];
  const updated = spawnArray.map((value) => {
    if (value === 0) {
      additions.push(8);
      return 6;
    } else {
      return value - 1;
    }
  });

  return [...updated, ...additions];
};

const tickSpawnsForDays = (
  spawnArray: number[],
  startDay: number,
  endDay: number
): number => {
  if (startDay === endDay) {
    return spawnArray.length;
  }
  if (spawnArray.length > CHUNK_SIZE) {
    const chunks = chunk(spawnArray, CHUNK_SIZE);

    return chunks
      .map(tickSpawnArray)
      .map((ticked) => tickSpawnsForDays(ticked, startDay + 1, endDay))
      .reduce((a, b) => a + b, 0);
  }
  const ticked = tickSpawnArray(spawnArray);
  return tickSpawnsForDays(ticked, startDay + 1, endDay);
};
const day6Part1Iterative = (day6Input: number[]) => {
  const days = new Array(DAYS).fill(0);

  return days.reduce((acc) => tickSpawnArray(acc), day6Input);
};

const groupInput = (input: number[]) =>
  input.reduce((acc, val) => {
    acc[val] ||= 0;
    acc[val] += 1;
    return acc;
  }, {} as Record<string, number>);

const day6 = (day6Input: number[]) => {
  const grouped = groupInput(day6Input);

  let iteration = grouped;

  for (let iter = 0; iter < DAYS; iter++) {
    const entries = Object.entries(grouped);
    iteration = entries.reduce((acc, [cycleVal, count]) => {
      if (iter % SPAWN_CYCLE === +cycleVal % SPAWN_CYCLE && iter >= +cycleVal) {
        acc[+iter + SPAWN_CYCLE + SPOOL] ||= 0;
        acc[+iter + SPAWN_CYCLE + SPOOL] += count;
      }
      return acc;
    }, iteration);
  }

  return Object.values(iteration).reduce((a, b) => a + b);
};

console.time("solve");
const result = day6(day6Input);
console.log({ result });
console.timeEnd("solve");
