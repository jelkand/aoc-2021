import { generateDiagonalNeighbors } from "../utils/neighbors.ts";

const day11Input = (await Deno.readTextFile("./day11-input"))
  .split("\n")
  .map((s) => s.split("").map(Number));

const TICKS = 100;

const incrementMatrix = (input: number[][]) =>
  input.map((row) => row.map((val) => val + 1));

const tick = (input: number[][]) => {
  const flashedThisTick = new Set<string>();

  const updatedMatrix = incrementMatrix(input);

  const flashPositions = updatedMatrix.flatMap((row, rowIdx) =>
    row
      .map((_, colIdx) => ({ row: rowIdx, col: colIdx }))
      .filter((_, colIdx) => {
        return updatedMatrix[rowIdx][colIdx] > 9;
      })
  );

  const flashPosition = (row: number, col: number) => {
    const key = `${row},${col}`;
    if (!flashedThisTick.has(key)) {
      // console.table(updatedMatrix);
      flashedThisTick.add(key);
      generateDiagonalNeighbors(input, row, col)
        .map((pos) => {
          updatedMatrix[pos[0]][pos[1]] += 1;
          return pos;
        })
        .filter((pos) => updatedMatrix[pos[0]][pos[1]] > 9)
        .forEach((pos) => flashPosition(pos[0], pos[1]));
    }
  };

  flashPositions.forEach(({ row, col }) => flashPosition(row, col));

  for (const pos of flashedThisTick) {
    const [row, col] = pos.split(",").map(Number);
    updatedMatrix[row][col] = 0;
  }

  return { updatedMatrix, flashedCount: flashedThisTick.size };
};

const day11Part1 = (input: number[][]) => {
  let flashed = 0;
  let matrix = input;
  for (let i = 0; i < TICKS; i++) {
    const { flashedCount, updatedMatrix } = tick(matrix);
    matrix = updatedMatrix;
    flashed += flashedCount;

    // console.log({ tick: i, matrix });
  }
  return flashed;
};

const part1Result = day11Part1(day11Input);
console.log({ part1Result });

const day11Part2 = (input: number[][]) => {
  let flashed = 0;
  let tickCounter = 0;
  let matrix = input;

  while (flashed !== input.length * input[0].length) {
    const { flashedCount, updatedMatrix } = tick(matrix);
    matrix = updatedMatrix;
    flashed = flashedCount;
    tickCounter++;
  }

  return tickCounter;
};

const part2Result = day11Part2(day11Input);
console.log({ part2Result });
