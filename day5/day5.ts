const day5Input = (await Deno.readTextFile("./day5-input")).split("\n");

type Point = {
  x: number;
  y: number;
};
type Line = Point[];

// only works with straight or exactly diagonal lines.
const pointsToLine = (p1: Point, p2: Point): Point[] => {
  if (p1.x === p2.x && p1.y === p2.y) {
    return [p2];
  }
  const xStep = Math.sign(p2.x - p1.x);
  const yStep = Math.sign(p2.y - p1.y);

  const nextPoint = {
    x: p1.x + xStep,
    y: p1.y + yStep,
  };
  return [p1, ...pointsToLine(nextPoint, p2)];
};

const parseDay5Input = (day5Input: string[]): Line[] =>
  day5Input
    .map((inputLine) =>
      inputLine.split(" -> ").map((pointStr) => {
        const [x, y] = pointStr.split(",").map(Number);
        return { x, y } as Point;
      })
    )
    // .filter(([p1, p2]) => p1.x === p2.x || p1.y === p2.y) // filter for part 1
    .map(([p1, p2]) => pointsToLine(p1, p2));

const parsedInput = parseDay5Input(day5Input);

const day5 = (parsedInput: Line[]) => {
  const accumulatedPoints = parsedInput.flat().reduce((acc, { x, y }) => {
    const key = `${x}-${y}`;
    acc[key] ||= 0;
    acc[key] += 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.values(accumulatedPoints).filter((seenTimes) => seenTimes > 1)
    .length;
};
console.log(day5(parsedInput));

// const parseDay5Input = (day5Input: string[]): LineSet => {};

/* Previous attempt at solving
interface LegacyLine {
  xRange: [number, number];
  yRange: [number, number];
}
type LegacyLineSet = Array<LegacyLine>;

const legacyParseDay5Input = (day5Input: string[]): LegacyLineSet =>
  day5Input
    .map((inputLine) =>
      inputLine.split(" -> ").reduce(
        (acc, curr, idx) => {
          const [x, y] = curr.split(",");
          acc.xRange[idx] = +x;
          acc.yRange[idx] = +y;
          return acc;
        },
        { xRange: [0, 0], yRange: [0, 0] } as LegacyLine
      )
    )
    .filter(
      ({ xRange, yRange }) =>
        distinct(xRange).length === 1 || distinct(yRange).length === 1
    )
    .map(({ xRange, yRange }) => ({
      xRange: xRange.sort(),
      yRange: yRange.sort(),
    }));

let accumulator = 0;
let accumulated = new Set();

const day5part1 = (parsedInput: LegacyLineSet) =>
  parsedInput
    .reduce((acc, { xRange, yRange }) => {
      for (let row = yRange[0]; row <= yRange[1]; row++) {
        acc[row] ||= [];
        for (let col = xRange[0]; col <= xRange[1]; col++) {
          acc[row][col] ||= 0;
          acc[row][col] += 1;
          if (acc[row][col] > 1) {
            console.log(accumulated.has([row, col]));
          }
          if (acc[row][col] > 1 && !accumulated.has([row, col])) {
            accumulator += 1;
            accumulated.add([row, col]);
          }
        }
      }
      return acc;
    }, [] as number[][])
    .flat()
    .filter((val) => val > 1).length;

const parsedDay5Input = legacyParseDay5Input(day5Input);
// console.table(day5part1(parsedDay5Input)); //
// console.log({ accumulator });
// console.log(accumulated.size);
// const otheracc = Object.values(otherAccumulator).filter(
//   (entry) => entry > 1
// ).length;
// console.log(otheracc);
// console.log(maxValues(day5Input));
*/
