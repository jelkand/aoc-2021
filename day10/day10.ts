const day10Input = (await Deno.readTextFile("./day10-input"))
  .split("\n")
  .map((s) => s.split(""));

const pairs: Record<string, string> = {
  "{": "}",
  "[": "]",
  "(": ")",
  "<": ">",
};

// type All = keyof typeof pairs | typeof pairs[keyof typeof pairs];

const openers = new Set(Object.keys(pairs));
const closers = new Set(Object.values(pairs));

const invalidScores: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const completionScores: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const calculateLine = (input: string[]) => {
  const stack: Array<string> = [];

  for (const char of input) {
    if (openers.has(char)) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (pairs[last!] !== char) {
        return { value: invalidScores[char], stack };
      }
    }
  }

  return { value: 0, stack };
};

const day10Part1 = (input: string[][]) => {
  return input.reduce((acc, line) => acc + calculateLine(line).value, 0);
};

const part1Result = day10Part1(day10Input);
console.log({ part1Result });

const finishStack = (stack: string[]) => {
  const outStack = [];
  while (!!stack.length) {
    const last = stack.pop();
    outStack.push(pairs[last!]);
  }
  return outStack;
};

const scoreStack = (stack: string[]) =>
  stack.reduce((acc, curr) => acc * 5 + completionScores[curr], 0);

const day10Part2 = (input: string[][]) => {
  const scored = input
    .map((line) => calculateLine(line))
    .filter(({ value }) => value === 0)
    .map(({ stack }) => finishStack(stack))
    .map(scoreStack)
    .sort((a, b) => a - b);

  return scored[Math.floor(scored.length / 2)];
};

const part2Result = day10Part2(day10Input);
console.log({ part2Result });
