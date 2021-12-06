// const day6Input = (await Deno.readTextFile("./sample-input"))
//   .split(",")
//   .map(Number);

// const DAYS = 256;
// const SPOOL = 2; // time from spawning to when a fish will start the regular spawn cycle
// const SPAWN_CYCLE = 7;

// const day6Part1 = (day6Input: number[]) =>
//   day6Input.length + sum(day6Input.map(countChildren));

// const sum = (args: number[]) => args.reduce((a, b) => a + b, 0);

// const spawnChildren = (spawnStartDate: number): number[] => {
//   // note the day at which a fish starts spawning is not the day at which it is spawned
//   if (spawnStartDate + SPAWN_CYCLE > DAYS) return [];
//   return [
//     spawnStartDate + SPAWN_CYCLE,
//     ...spawnChildren(spawnStartDate + SPAWN_CYCLE),
//   ];
// };

// const spawnChildrenIterative = (spawnStartDate: number): number[] => {
//   let lastSpawnDate = spawnStartDate;
//   const spawns = [];

//   while (lastSpawnDate < DAYS) {
//     lastSpawnDate += SPAWN_CYCLE;
//     spawns.push(lastSpawnDate);
//   }

//   return spawns;
// };

// // console.log(spawnChildren(1), spawnChildrenIterative(1));

// const countChildren = (spawnStartDate: number): number => {
//   if (spawnStartDate > DAYS) {
//     return 0;
//   }

//   // increment children to the point where they are on a spawn cycle
//   const childrenStarts = spawnChildren(spawnStartDate).map((s) => s + SPOOL);

//   return childrenStarts.length + sum(childrenStarts.map(countChildren));
// };

// const day6p1 = day6Part1(day6Input);
// console.log({ day6p1 });

// // console.log(spawnChildren(9));
