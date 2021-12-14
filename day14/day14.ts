import { slidingWindows } from "https://deno.land/std@0.117.0/collections/mod.ts";

export const [rawInitial, rawRules] = (
  await Deno.readTextFile("./sample-input")
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

const tickTemplate = (template: string[]): string[] => {
  if (template.length === 1) return [template[0]];
  const [head, ...rest] = template;
  const toInsert = rules[head][rest[0]];
  return [head, toInsert, ...tickTemplate(rest)];
};

//memoizable
const tickTemplateDeep = (pair: string[], depth: number): string[] => {
  const [first, last] = pair;
  const middle = rules[first][last];
  if (depth === TICKS) return [first, middle, last];

  const initial = tickTemplateDeep([first, middle], depth + 1);
  const [_, ...final] = tickTemplateDeep([middle, last], depth + 1);
  return [...initial, ...final];
};

const cache: Record<string, string[]> = {};

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

const tickTemplateMemo = (pair: string[], depth: number): string[] => {
  const cacheKey = [...pair, depth].join("");
  if (cache[cacheKey]) return cache[cacheKey];

  const [first, last] = pair;
  const middle = rules[first][last];
  if (depth === 1) return [first, middle, last];

  const initial = tickTemplateMemo([first, middle], depth - 1);
  const [_, ...final] = tickTemplateMemo([middle, last], depth - 1);
  const result = [...initial, ...final];
  cache[cacheKey] = result;
  return result;
};

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

const TICKS = 10;

const day14 = (input: string[]) => {
  const windows = slidingWindows(input, 2);
  const result = countRecursive(windows[0], TICKS);
  const sorted = Object.entries(result).sort((a, b) => a[1] - b[1]);
  return sorted[sorted.length - 1][1] - sorted[0][1];
};

const part1 = day14(initial);
console.log({ part1 });
