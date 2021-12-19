export const input = await Deno.readTextFile("./day16-input");

const hexToBinary = (input: string[]) =>
  input.reduce<number[]>(
    (acc, char) => [
      ...acc,
      ...parseInt(char, 16).toString(2).padStart(4).split("").map(Number),
    ],
    []
  );

const binaryToDecimal = (input: number[]) => parseInt(input.join(""), 2);

type Packet = {
  version: number;
  type: number;
  value: number;
  length?: number;
};

enum Operation {
  Sum = 0,
  Product = 1,
  Min = 2,
  Max = 3,
  Value = 4,
  GreaterThan = 5,
  LessThan = 6,
  EqualTo = 7,
}

type Operator = (packets: Packet[]) => number;

const sumPackets = (packets: Packet[]) =>
  packets.reduce((acc, { value }) => acc + value, 0);
const multiplyPackets = (packets: Packet[]) =>
  packets.reduce((acc, { value }) => acc * value, 1);
const minPackets = (packets: Packet[]) =>
  packets.reduce(
    (acc, { value }) => Math.min(acc, value || Infinity),
    Infinity
  );
const maxPackets = (packets: Packet[]) =>
  packets.reduce((acc, { value }) => Math.max(acc, value), -Infinity);
const gtPackets = (packets: Packet[]) =>
  packets[0].value > packets[1].value ? 1 : 0;
const ltPackets = (packets: Packet[]) =>
  packets[0].value < packets[1].value ? 1 : 0;
const eqPackets = (packets: Packet[]) =>
  packets[0].value === packets[1].value ? 1 : 0;

class PacketParser {
  packet: number[];
  cursor = 0;
  parsedPackets: Packet[] = [];
  versionSum = 0;

  operationMap: Record<Operation, Operator> = {
    [Operation.Sum]: sumPackets,
    [Operation.Product]: multiplyPackets,
    [Operation.Min]: minPackets,
    [Operation.Max]: maxPackets,
    [Operation.Value]: () => binaryToDecimal(this.parseLiteralPacket()),
    [Operation.GreaterThan]: gtPackets,
    [Operation.LessThan]: ltPackets,
    [Operation.EqualTo]: eqPackets,
  };

  constructor(packet: number[]) {
    this.packet = packet;
  }

  parse() {
    const nextPacket = this.parseNextPacket();
    this.parsedPackets.push(nextPacket);
  }

  parseNextPacket(): Packet {
    const version = binaryToDecimal(
      this.packet.slice(this.cursor, (this.cursor += 3))
    );
    this.versionSum += version;
    const type = binaryToDecimal(
      this.packet.slice(this.cursor, (this.cursor += 3))
    );

    const operation = this.operationMap[type as Operation];

    let subpackets;
    let value;
    if (type === 4) {
      value = binaryToDecimal(this.parseLiteralPacket());
    } else {
      subpackets = this.parseSubpackets();
      value = operation(subpackets);
    }

    return {
      version,
      type,
      value,
    };
  }

  parseSubpackets(): Packet[] {
    const lengthType = this.packet[this.cursor];
    this.cursor += 1;

    const subpackets: Packet[] = [];

    if (lengthType === 0) {
      const subPacketsSize = binaryToDecimal(
        this.packet.slice(this.cursor, (this.cursor += 15))
      );
      const limit = this.cursor + subPacketsSize;
      while (this.cursor < limit) {
        subpackets.push(this.parseNextPacket());
      }
    } else if (lengthType) {
      const subPacketsCount = binaryToDecimal(
        this.packet.slice(this.cursor, (this.cursor += 11))
      );
      for (let i = 0; i < subPacketsCount; i++) {
        const nextPacket = this.parseNextPacket();
        subpackets.push(nextPacket);
      }
    }

    return subpackets;
  }

  parseLiteralPacket(): number[] {
    const first = this.packet[this.cursor];
    this.cursor += 1;
    const digit = this.packet.slice(this.cursor, (this.cursor += 4));
    if (first === 0) {
      return digit;
    }

    return [...digit, ...this.parseLiteralPacket()];
  }
}

const parser = new PacketParser(hexToBinary(input.split("")));
parser.parse();

console.log(parser.parsedPackets[0].value); // 12301926782560
