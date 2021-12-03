const rawInput = await Deno.readTextFile("./day3-input");

const parseSummedArray = (threshold: number, summedArray: number[]) => {
  const accumulator = {
    gamma: [] as number[],
    epsilon: [] as number[],
  };
  return summedArray.reduce((acc, curr) => {
    if (curr > threshold) {
      acc.gamma.push(1);
      acc.epsilon.push(0);
    } else {
      acc.gamma.push(0);
      acc.epsilon.push(1);
    }
    return acc;
  }, accumulator);
};

const binaryArrayToNumber = (binaryArray: number[]): number => {
  return parseInt(binaryArray.join(""), 2);
};

const part1 = (input: string) => {
  const inputArray = input.split("\n");

  const inputLength = inputArray.length;
  const threshold = inputLength / 2;

  const accumulatorSize = inputArray[0].length;
  const accumulator = new Array(accumulatorSize).fill(0, 0, accumulatorSize);
  const summedArray = inputArray
    .map((str) => str.split("").map(Number))
    .reduce((acc, curr) => {
      curr.forEach((val, idx) => {
        acc[idx] += val;
      });
      return acc;
    }, accumulator);

  const { epsilon, gamma } = parseSummedArray(threshold, summedArray);
  return binaryArrayToNumber(epsilon) * binaryArrayToNumber(gamma);
};

const part1Result = part1(rawInput); //4160394
console.log({ part1Result });

type Matrix = Array<Array<"0" | "1">>;

type PartitionedMatrix = Record<"0" | "1", Matrix>;

const partitionMatrix = (matrix: Matrix) => {
  return matrix.reduce((acc, curr) => {
    const [key, ...rest] = curr;
    acc[key] ||= [];
    acc[key].push(rest);
    return acc;
  }, {} as PartitionedMatrix);
};
type Comparator = (partitionedMatrix: PartitionedMatrix) => ["0" | "1", Matrix];

const oxyComparator: Comparator = (partitionedMatrix: PartitionedMatrix) => {
  const zeros = partitionedMatrix["0"];
  const ones = partitionedMatrix["1"];
  const zerosCount = zeros?.length;
  const onesCount = ones?.length;
  if (!zerosCount) {
    return ["1", ones];
  } else if (!onesCount) {
    return ["0", zeros];
  } else {
    return zerosCount > onesCount ? ["0", zeros] : ["1", ones];
  }
};

const co2Comparator: Comparator = (partitionedMatrix: PartitionedMatrix) => {
  const zeros = partitionedMatrix["0"];
  const ones = partitionedMatrix["1"];
  const zerosCount = zeros?.length;
  const onesCount = ones?.length;

  if (!zerosCount) {
    return ["1", ones];
  } else if (!onesCount) {
    return ["0", zeros];
  } else {
    return zerosCount <= onesCount ? ["0", zeros] : ["1", ones];
  }
};

const recurseFilter = (comparator: Comparator, matrix: Matrix): string => {
  const partitioned = partitionMatrix(matrix);
  const [key, selectedMatrix] = comparator(partitioned);
  if (!selectedMatrix || selectedMatrix.flat().length === 0) {
    return key;
  } else {
    return key + recurseFilter(comparator, selectedMatrix);
  }
};

const part2 = (input: string) => {
  const inputArray = input.split("\n").map((str) => str.split("")) as Matrix;

  const oxyBinary = recurseFilter(oxyComparator, inputArray);
  const co2Binary = recurseFilter(co2Comparator, inputArray);

  const oxyDecimal = parseInt(oxyBinary, 2);
  const co2Decimal = parseInt(co2Binary, 2);
  return oxyDecimal * co2Decimal;
};

const part2Result = part2(rawInput);
console.log({ part2Result });
