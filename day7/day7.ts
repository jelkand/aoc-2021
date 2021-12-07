const day7Input = (await Deno.readTextFile("./day7-input"))
  .split(",")
  .map(Number);

// find median
const day7Part1 = (nums: number[]) => {
  const sorted = nums.sort((a, b) => a - b);
  const middle = Math.ceil(nums.length / 2);
  const median = sorted[middle];
  return nums.reduce((acc, val) => (acc += Math.abs(val - median)), 0);
};

console.log(day7Part1(day7Input)); // 345197

// least squares-ish
const day7Part2 = (nums: number[]) => {
  const average = Math.floor(nums.reduce((a, b) => a + b) / nums.length);
  return nums.reduce((acc, val) => {
    const distance = Math.abs(val - average);
    const sum = (distance ** 2 + distance) / 2;
    return acc + sum;
  }, 0);
};

console.log(day7Part2(day7Input)); // 96361606
