import {
  difference,
  intersection,
  isSuperset,
  setEq,
  symmetricDifference,
  union,
} from "./set.ts";

const day8Input: Input[] = (await Deno.readTextFile("./day8-input"))
  .split("\n")
  .map((line) => {
    const [inputs, outputs] = line.trim().split(" | ");
    return {
      inputs: inputs.trim().split(" "),
      outputs: outputs.trim().split(" "),
    };
  });

type Input = {
  inputs: string[];
  outputs: string[];
};

type InputList = Input[];

const day8Part1 = (input: Input[]) => {
  return input.reduce((acc, { outputs }) => {
    return (
      acc + outputs.filter((val) => [2, 3, 4, 7].includes(val.length)).length
    );
  }, 0);
};

const unionAll = (sets: Set<string>[]) =>
  sets.reduce((acc, curr) => union(acc, curr), new Set<string>());

const createSignalMap = ({ inputs, outputs }: Input) => {
  const inputSets = inputs.map((str) => new Set(str.split("")));

  const ONE = inputSets.find((s) => s.size === 2)!;
  const THREE = inputSets.find(
    (s) => s.size === 5 && difference(s, ONE).size === 3
  )!;
  const FOUR = inputSets.find((s) => s.size === 4)!;
  const SEVEN = inputSets.find((s) => s.size === 3)!;
  const EIGHT = inputSets.find((s) => s.size === 7)!;

  const uknSigs = inputSets
    .filter((s) => ![ONE, THREE, FOUR, SEVEN, EIGHT].includes(s))
    .reduce((acc, s) => {
      acc[s.size] ||= [];
      acc[s.size].push(s);
      return acc;
    }, {} as { [key: string]: Set<string>[] });

  const A = difference(SEVEN, ONE);
  const BD = difference(FOUR, ONE);

  const BE = difference(union(uknSigs[5][0], uknSigs[5][1]), THREE);
  const B = intersection(BD, BE);
  const D = difference(BD, B);
  const E = difference(BE, B);

  const ZERO = uknSigs[6].find((s) => !isSuperset(s, D));
  uknSigs[6] = uknSigs[6].filter((s) => s !== ZERO);

  const CE = symmetricDifference(uknSigs[6][0], uknSigs[6][1]);
  const C = intersection(CE, ONE);
  const F = difference(ONE, C);
  const G = difference(EIGHT, union(union(FOUR, A), E));

  const signalSetMap: Array<[Set<string>, number]> = [];
  signalSetMap.push([difference(EIGHT, D), 0]);
  signalSetMap.push([ONE, 1]);
  signalSetMap.push([unionAll([A, C, D, E, G]), 2]);
  signalSetMap.push([THREE, 3]);
  signalSetMap.push([FOUR, 4]);
  signalSetMap.push([unionAll([A, B, D, F, G]), 5]);
  signalSetMap.push([difference(EIGHT, C), 6]);
  signalSetMap.push([SEVEN, 7]);
  signalSetMap.push([EIGHT, 8]);
  signalSetMap.push([difference(EIGHT, E), 9]);

  const lineSum = outputs.reduce((acc, output) => {
    const outputSet = new Set(output.split(""));
    const value = signalSetMap.find(([s]) => setEq(s, outputSet))![1];
    return acc + value.toString();
  }, "");

  return +lineSum;
};

const day8Part2 = (input: Input[]) => {
  return input.reduce((acc, line) => {
    return acc + createSignalMap(line);
  }, 0);
};

const part2Result = day8Part2(day8Input);
console.log({ part2Result });

// where - operator indicates a set difference
// ∪ indicates a union

// SIGNAL RULES:
// A          = 7 - 1 // done
// B          = (B ∪ D) - D // done
// C          = 1 - F
// D          = (B ∪ D ∪ E) - (B ∪ E)
// E          = (B ∪ D ∪ E) - (B ∪ D)
// F          = ((2 - 5) ∪ (5 - 2)) - B - E
// G          = (8 - 7 - 4 - E)

// B ∪ D ∪ E  = ((8 - 0) ∪ (8 - 6) ∪ (8 - 9))  note we do not need to know which is 0, 6, or 9
// B ∪ D      = 4 - 1
// B ∪ E      = (2 ∪ 5) - 3

// C ∪ F      = 1
// NUMBER RULES:
// 0 = length 6 && contains D
// 1 = length 2
// 2 = length 5 && ?
// 3 = length 5 and (3 - 1 = length 3)
// 4 = length 4
// 5 = length 5 && ?
// 6 = length 6 && ?
// 7 = length 3
// 8 = length 7
// 9 = length 6 && ?
