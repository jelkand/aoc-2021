const input = await Deno.readTextFile("./day2.txt");
const inputArray = input.split("\n");

type Command = "forward" | "up" | "down";

const commandToObj = (commandString: string) => {
  const [command, value] = commandString.split(" ");
  return {
    command: command as Command,
    value: +value,
  };
};

type CommandSet = { forward: number; up: number; down: number };

const commandSet = inputArray.map(commandToObj).reduce(
  (acc, { command, value }) => {
    acc[command] += value;
    return acc;
  },
  { forward: 0, up: 0, down: 0 }
);

const _commandSetToPosVal = ({ down, up, forward }: CommandSet): number => {
  const depth = down - up;
  return depth * forward;
};
// console.log(commandSetToPosVal(commandSet));

const part2Position = inputArray.map(commandToObj).reduce(
  (acc, { command, value }) => {
    switch (command) {
      case "forward":
        acc.x += value;
        acc.y += value * acc.aim;
        break;
      case "up":
        acc.aim -= value;
        break;
      case "down":
        acc.aim += value;
        break;
    }
    return acc;
  },
  { x: 0, y: 0, aim: 0 }
);
console.log(part2Position.x * part2Position.y);
