import { difference, intersection, union } from "../day8/set.ts";
import { DIRECTIONS, generateNeighbors } from "../utils/neighbors.ts";

const day9Input = (await Deno.readTextFile("./day9-input"))
  .split("\n")
  .map((s) => s.split("").map(Number));

const checkLocalLow = (
  input: number[][],
  colIdx: number,
  rowIdx: number,
  height: number
) =>
  generateNeighbors(input, colIdx, rowIdx).reduce(
    (acc, neighbor) => acc && input[neighbor[0]][neighbor[1]] > height,
    true
  );

const day9Part1 = (input: number[][]) => {
  return input.reduce((acc, row, rowIdx) => {
    return (
      acc +
      row.reduce((innerAcc, height, colIdx) => {
        return (
          innerAcc +
          (checkLocalLow(input, colIdx, rowIdx, height) ? height + 1 : 0)
        );
      }, 0)
    );
  }, 0);
};

const part1Result = day9Part1(day9Input);

console.log({ part1Result });

const generateNodeList = (input: number[][]) => {
  return input.reduce((acc, row, rowIdx) => {
    const set = row.reduce(
      (innerSet, height, colIdx) =>
        height < 9 ? innerSet.add(`${rowIdx},${colIdx}`) : innerSet,
      new Set<string>()
    );

    return union(acc, set);
  }, new Set<string>());
};

const generateNeighborNodes = (row: number, col: number): Set<string> =>
  DIRECTIONS.reduce(
    (acc, dir) => acc.add(`${row + dir[0]},${col + dir[1]}`),
    new Set<string>()
  );

const day6Part2 = (input: number[][]) => {
  let unpaintedNodes = generateNodeList(input);
  const groups = [];

  let initial = unpaintedNodes.values().next().value;

  const paintAdjacentNodes = (seed: string): Set<string> => {
    const [row, col] = seed.split(",").map(Number);
    const neighborNodes = generateNeighborNodes(row, col);
    const unpaintedNeighbors = intersection(neighborNodes, unpaintedNodes);

    unpaintedNodes = difference(unpaintedNodes, unpaintedNeighbors);

    if (neighborNodes.size === 0) {
      return new Set();
    } else {
      const recurse = Array.from(unpaintedNeighbors).reduce(
        (acc, neighbor) => union(acc, paintAdjacentNodes(neighbor)),
        new Set<string>()
      );

      return union(unpaintedNeighbors, recurse).add(seed);
    }
  };

  while (unpaintedNodes.size > 0) {
    unpaintedNodes.delete(initial);
    const group = paintAdjacentNodes(initial);
    groups.push(group);

    unpaintedNodes = difference(unpaintedNodes, group);
    initial = unpaintedNodes.values().next().value;
  }

  groups.sort((a, b) => b.size - a.size);

  const top3 = groups.slice(0, 3);

  return top3.reduce((acc, curr) => acc * curr.size, 1);
};

const part2Result = day6Part2(day9Input);
console.log({ part2Result });
