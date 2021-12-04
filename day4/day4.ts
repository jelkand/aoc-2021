const [rawBingoDraws, ...rawBingoBoards] = (
  await Deno.readTextFile("./day4-input")
).split("\n\n");

const bingoDraws = rawBingoDraws.split(",").map(Number);

// noodling about data structure
interface Board {
  rawBoard: number[][];
  keyMap: KeyMap;
  rowHits: number[];
  colHits: number[];
  hitSum: number;
  totalSum: number;
  hasWon: boolean;
}

interface KeyMap {
  [key: string]: {
    row: number;
    col: number;
    hit: boolean;
  };
}

const formatBingoBoards = (rawBingoBoards: string[]) => {
  return rawBingoBoards.map((board) => {
    const rawBoard = board
      .split("\n")
      .map((row) => row.trim().split(/ +/).map(Number));

    const keyMap = rawBoard.reduce((acc, row, rowIdx) => {
      const subAccumulator = row.reduce((acc, key, colIdx) => {
        acc[key] = {
          row: rowIdx,
          col: colIdx,
          hit: false,
        };
        return acc;
      }, {} as KeyMap);
      return {
        ...acc,
        ...subAccumulator,
      };
    }, {} as KeyMap);

    const rowHits = new Array(rawBoard[0].length).fill(0);
    const colHits = new Array(rawBoard.length).fill(0);

    const totalSum = rawBoard.flat().reduce((a, b) => a + b, 0);

    return {
      rawBoard,
      keyMap,
      rowHits,
      colHits,
      totalSum,
      hitSum: 0,
      hasWon: false,
    };
  });
};

const processDraw =
  (draw: number) =>
  (board: Board): Board => {
    let { colHits, rowHits, keyMap, hitSum, hasWon } = board;
    if (draw in keyMap) {
      const { col, row } = keyMap[draw];
      keyMap[draw].hit = true;
      colHits[col] += 1;
      rowHits[row] += 1;
      hitSum += draw;
      hasWon =
        hasWon ||
        !!colHits.filter((v) => v >= colHits.length).length ||
        !!rowHits.filter((v) => v >= rowHits.length).length;
    }

    return {
      ...board,
      keyMap,
      hitSum,
      hasWon,
    };
  };

const day4part1 = (bingoDraws: number[], rawBingoBoards: string[]) => {
  let bingoBoards = formatBingoBoards(rawBingoBoards);

  let firstWinner, lastDraw;

  for (const draw of bingoDraws) {
    const processor = processDraw(draw);
    bingoBoards = bingoBoards.map(processor);
    const won = bingoBoards.filter((bb) => bb.hasWon);
    if (won.length) {
      firstWinner = won[0];
      lastDraw = draw;
      break;
    }
  }

  if (!firstWinner || !lastDraw) throw new Error("should not be possible");

  return (firstWinner.totalSum - firstWinner.hitSum) * lastDraw;
};

const day4part2 = (bingoDraws: number[], rawBingoBoards: string[]) => {
  let bingoBoards = formatBingoBoards(rawBingoBoards);

  let lastWinner, lastDraw;

  for (const draw of bingoDraws) {
    const processor = processDraw(draw);
    bingoBoards = bingoBoards.map(processor);
    const won = bingoBoards.filter((bb) => bb.hasWon);
    if (won.length === bingoBoards.length) {
      lastWinner = won.pop();
      lastDraw = draw;
      break;
    }
    bingoBoards = bingoBoards.filter((bb) => !bb.hasWon);
  }

  if (!lastWinner || !lastDraw) throw new Error("should not be possible");

  return (lastWinner.totalSum - lastWinner.hitSum) * lastDraw;
};

console.log(day4part2(bingoDraws, rawBingoBoards));

/* 
* data structure noodling:


board = {}
*/
