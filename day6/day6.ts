const day6Input = (await Deno.readTextFile("./day6-input"))
  .split(",")
  .map(Number);

const DAYS = 256;
const SPAWN_CYCLE = 7;
const SPOOL = 2;

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
