export const [rawDots, rawFolds] = (
  await Deno.readTextFile("./day13-input")
).split("\n\n");

// dot format is [col, row]

interface Fold {
  axis: "x" | "y";
  value: number;
}

const dots = rawDots.split("\n").map((s) => s.split(",").map(Number));
const folds = rawFolds.split("\n").map((s) => {
  const [, axis, value] = s.match(/(x|y)=(\d*)/) || [];
  return {
    axis,
    value: +value,
  } as Fold;
});

const generateMatrix = (dots: number[][]) => {
  const { x: maxX, y: maxY } = dots.reduce(
    (acc, dot) => ({
      x: Math.max(dot[0], acc.x),
      y: Math.max(dot[1], acc.y),
    }),
    { x: 0, y: 0 }
  );

  const matrix = new Array(maxY + 1)
    .fill(0)
    .map(() => new Array(maxX + 1).fill(0));
  dots.forEach(([row, col]) => {
    matrix[col][row] = 1;
  });

  return matrix;
};

const matrix = generateMatrix(dots);
// console.log({matrix})

const transposeMatrix = (matrix: number[][]) =>
  matrix[0].map((_, colIdx) => matrix.map((row) => row[colIdx]));

const addMatrices = (first: number[][], second: number[][]) => {
  second.forEach((row, rowIdx) =>
    row.forEach((val, colIdx) => (first[rowIdx][colIdx] += val))
  );
  return first;
};

const foldMatrix = (matrix: number[][], { axis, value }: Fold) => {
  const workingMatrix = axis === "y" ? matrix : transposeMatrix(matrix);

  const above = workingMatrix.slice(0, value);
  const below = workingMatrix.slice(value + 1);

  const combined = addMatrices(above.reverse(), below).reverse();

  return axis === "y" ? combined : transposeMatrix(combined);
};

const day13Part1 = (matrix: number[][], folds: Fold[]) => {
  const firstFolds = folds.slice(0, 1);

  const reduced = firstFolds.reduce(
    (acc, fold) => foldMatrix(acc, fold),
    matrix
  );
  // console.table(reduced);

  return reduced.reduce(
    (acc, row) =>
      acc + row.reduce((count, val) => count + (val > 0 ? 1 : 0), 0),
    0
  );
};

const day13Part2 = (matrix: number[][], folds: Fold[]) =>
  folds.reduce((acc, fold) => foldMatrix(acc, fold), matrix);

const part1Result = day13Part1(matrix, folds);
console.log({ part1Result }); // 592

console.table(day13Part2(matrix, folds)); // JGAJEFKU
