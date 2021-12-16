import { generateNeighborsMax } from "../utils/neighbors.ts";
export const input = (await Deno.readTextFile("./day15-input"))
  .split("\n")
  .map((s) => s.split("").map(Number));

const fromKey = (key: string) => key.split(",").map(Number);
const toKey = (args: number[]) => args.join(",");

const initializeUnvisitedNodesObj = (rows: number, cols: number) => {
  const unvisitedNodes: Record<string, number> = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      unvisitedNodes[toKey([i, j])] = Infinity;
    }
  }
  return unvisitedNodes;
};

const getValueAtPosition = (
  input: number[][],
  projectedRow: number,
  projectedCol: number
) => {
  const tileRows = input.length;
  const tileCols = input[0].length;
  const shiftSize =
    Math.floor(projectedRow / tileRows) + Math.floor(projectedCol / tileCols);

  const row = projectedRow % tileRows;
  const col = projectedCol % tileCols;
  return ((input[row][col] + shiftSize - 1) % 9) + 1; // doing some offsets since 0 is not valid
};

const djikstras = (
  input: number[][],
  start: string,
  end: string,
  tiles = 1
) => {
  const tileRows = input.length;
  const tileCols = input[0].length;

  const maxRow = tileRows * tiles;
  const maxCol = tileCols * tiles;

  const unvisitedNodes = initializeUnvisitedNodesObj(maxRow, maxCol);
  const visitedNodes = {} as Record<string, number>;

  let queue = [start];

  while (queue.length) {
    const node = queue.shift();
    const [row, col] = fromKey(node!);

    visitedNodes[node!] =
      node === start
        ? getValueAtPosition(input, row, col)
        : unvisitedNodes[node!];
    delete unvisitedNodes[node!];

    const neighbors = generateNeighborsMax(maxRow, maxCol, row, col).filter(
      (position) => !!unvisitedNodes[toKey(position)]
    );

    neighbors.forEach(([nRow, nCol]) => {
      const nKey = toKey([nRow, nCol]);
      unvisitedNodes[nKey] = Math.min(
        unvisitedNodes[nKey],
        visitedNodes[node!] + getValueAtPosition(input, nRow, nCol)
      );
    });

    queue = [...queue, ...neighbors.map(toKey)]
      .filter((pos) => !!unvisitedNodes[pos])
      .sort((aPos, bPos) => unvisitedNodes[aPos] - unvisitedNodes[bPos]);
  }

  return visitedNodes[end] - visitedNodes[start];
};

// const part1 = djikstras(input, "0,0", "99,99");

// console.log({ part1 });

const day15 = (input: number[][], tiles = 1) => {
  const startKey = "0,0";
  const endKey = `${input.length * tiles - 1},${input[0].length * tiles - 1}`;
  const result = djikstras(input, startKey, endKey, tiles);
  return result;
};

console.log(day15(input, 5));

// const test =
