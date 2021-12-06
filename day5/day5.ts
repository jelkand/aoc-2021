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
