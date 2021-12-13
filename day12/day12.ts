export const day12Input = (await Deno.readTextFile("./day12-input"))
  .split("\n")
  .map((s) => s.split("-"));

type AdjacencyList = Record<string, Set<string>>;

const buildAdjacencyList = (input: string[][]) =>
  input.reduce((acc, edge) => {
    acc[edge[0]] ||= new Set<string>();
    acc[edge[1]] ||= new Set<string>();
    acc[edge[0]].add(edge[1]);
    acc[edge[1]].add(edge[0]);

    return acc;
  }, {} as AdjacencyList);

type Rule = (node: string, visited: Record<string, number>) => boolean;
const isEnd: Rule = (node) => node === "end";
const isUpperCase: Rule = (node) => node.toUpperCase() === node;
const underMaxVisits =
  (maxVisits: number): Rule =>
  (node, visited) =>
    node !== "start" && (visited[node] || 0) < maxVisits;

const hasNotVisitedSmallCaveTwice: Rule = (node, visited) => {
  const hasVisitedSomeSmallCaveTwice = Object.entries(visited).some(
    (entry) => entry[0].toLowerCase() === entry[0] && entry[1] > 1
  );
  return underMaxVisits(hasVisitedSomeSmallCaveTwice ? 1 : 2)(node, visited);
};

const createRuleSet =
  (rules: Record<string, Rule>): Rule =>
  (...args) =>
    Object.values(rules).some((rule) => rule(...args));

const findPaths = (
  adjList: AdjacencyList,
  visited: Record<string, number>,
  rules: Record<string, Rule>,
  start: string,
  end: string
): string[][] => {
  if (start === end) {
    return [[start]];
  }

  const neighbors = adjList[start];

  const ruleSet = createRuleSet(rules);

  const result = Array.from(neighbors)
    .filter((neighbor) => ruleSet(neighbor, visited))
    .flatMap((n) => {
      const nextVisited = {
        ...visited,
        [n]: visited[n] ? visited[n] + 1 : 1,
      };
      return findPaths(adjList, nextVisited, rules, n, end);
    })
    .map((path) => (Array.isArray(path) ? [start, ...path] : [start, path]));

  return result;
};

const day12Part1 = (input: string[][]) => {
  const adjList = buildAdjacencyList(input);

  const rules = { isEnd, isUpperCase, caveVisitCount: underMaxVisits(1) };

  const paths = findPaths(adjList, {}, rules, "start", "end");
  return paths.length;
};

console.time("part1");
const part1Result = day12Part1(day12Input);
console.timeEnd("part1");
console.log({ part1Result });

const day12Part2 = (input: string[][]) => {
  const adjList = buildAdjacencyList(input);

  const rules = {
    isEnd,
    isUpperCase,
    caveVisitCount: hasNotVisitedSmallCaveTwice,
  };

  const paths = findPaths(adjList, {}, rules, "start", "end");
  return paths.length;
};

console.time("part2");
const part2Result = day12Part2(day12Input);
console.timeEnd("part2");
console.log({ part2Result });
