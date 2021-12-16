import { slidingWindows } from "https://deno.land/std@0.117.0/collections/mod.ts";

export const [rawInitial, rawRules] = (
  await Deno.readTextFile("./day14-input")
).split("\n\n");

const initial = rawInitial.split("");

type RuleMap = Record<string, Record<string, string>>;
const rules = rawRules.split("\n").reduce((acc, rule) => {
  const [key, insert] = rule.split(" -> ");
  const [first, second] = key.split("");
  return {
    ...acc,
    [first]: {
      ...acc[first],
      [second]: insert,
    },
  };
}, {} as RuleMap);

const countCache: Record<string, Record<string, number>> = {};

const mergeObjects = (
  first: Record<string, number>,
  second: Record<string, number>
) => {
  Object.entries(second).forEach(([k, v]) => (first[k] = first[k] + v || v));
  return first;
};

const countKeys = (strArray: string[]) =>
  strArray.reduce(
    (acc, char) => ({
      ...acc,
      [char]: acc[char] + 1 || 1,
    }),
    {} as Record<string, number>
  );

const countRecursive = (
  pair: string[],
  depth: number
): Record<string, number> => {
  const cacheKey = [...pair, depth].join("");
  if (countCache[cacheKey]) return { ...countCache[cacheKey] };
  const [first, last] = pair;
  const middle = rules[first][last];
  if (depth === 1) return countKeys([first, middle, last]);
  const initial = countRecursive([first, middle], depth - 1);
  const final = countRecursive([middle, last], depth - 1);
  final[middle] -= 1; // subtract because the first key of final is also the last key of initial
  const result = mergeObjects(initial, final);
  countCache[cacheKey] = { ...result };
  return result;
};

const TICKS = 1022;

const day14 = (input: string[]) => {
  const windows = slidingWindows(input, 2);
  const result = windows.reduce((acc, window) => {
    const wCounts = countRecursive(window, TICKS);
    wCounts[window[1]] -= 1; // remove double counting for window overlap
    return mergeObjects(acc, wCounts);
  }, {} as Record<string, number>);

  result[windows[windows.length - 1][1]] += 1; // don't remove the final letter in the above dobule counting squad
  const sorted = Object.entries(result).sort((a, b) => a[1] - b[1]);
  return sorted[sorted.length - 1][1] - sorted[0][1];
};

console.time();
const result = day14(initial);
console.timeEnd();
console.log(countCache["FS900"]);
console.log({ result });
