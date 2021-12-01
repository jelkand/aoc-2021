import { readLines } from "https://deno.land/std@0.89.0/io/mod.ts";
import * as path from "https://deno.land/std@0.89.0/path/mod.ts";

const filename = path.join(Deno.cwd(), "./part1-input.txt");
let fileReader = await Deno.open(filename);

let increaseCount = 0;
let prevValue = undefined;

for await (let line of readLines(fileReader)) {
  const lineValue = Number(line);
  if (prevValue && lineValue > prevValue) {
    increaseCount++;
  }
  prevValue = lineValue;
}

console.log(increaseCount);
