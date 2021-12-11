export const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export const DIRECTIONS_DIAGONAL = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];

export const generateNeighbors = (
  input: number[][],
  colIdx: number,
  rowIdx: number
): number[][] =>
  DIRECTIONS.map(([row, col]) => [row + rowIdx, col + colIdx]).filter(
    ([row, col]) =>
      row >= 0 && row < input.length && col >= 0 && col < input[0].length
  );

export const generateDiagonalNeighbors = (
  input: number[][],
  rowIdx: number,
  colIdx: number
): number[][] =>
  DIRECTIONS_DIAGONAL.map(([row, col]) => [row + rowIdx, col + colIdx]).filter(
    ([row, col]) =>
      row >= 0 && row < input.length && col >= 0 && col < input[0].length
  );
