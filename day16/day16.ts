export const input = (await Deno.readTextFile("./sample-input")).split("");

console.log({ input });

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
  subpackets?: Packet[];
  value?: number;
  length?: number;
};

class PacketParser {
  packet: number[];
  cursor = 0;
  parsedPackets: Packet[] = [];
  // cursorLimit = Infinity;
  // packetLimit = Infinity;
  versionSum = 0;

  constructor(rawPacket: string) {
    this.packet = hexToBinary(rawPacket.split(""));
  }

  parse() {
    while (this.packet.length) {
      this.parsedPackets.push(this.parseNextPacket());
    }
  }

  parseNextPacket(): Packet {
    const version = binaryToDecimal(
      this.packet.slice(this.cursor, (this.cursor += 3))
    );
    const type = binaryToDecimal(
      this.packet.slice(this.cursor, (this.cursor += 3))
    );

    if (type === 4) {
      return {
        version,
        type,
        value: binaryToDecimal(parseLiteralPacket(this.packet)),
      };
    }

    const subpackets = this.parseOperatorPacket();

    console.log("class", { version, type });

    return {
      version,
      type,
      subpackets,
    };
  }

  parseOperatorPacket(): Packet[] {
    const lengthType = this.packet.shift();
    // const packetSize = lengthType ? 11 : 15;

    const subpackets: Packet[] = [];

    if (lengthType === 0) {
      const subPacketsSize = binaryToDecimal(
        this.packet.slice(this.cursor, (this.cursor += 15))
      );
      const limit = this.cursor + subPacketsSize;
      while (this.cursor <= limit) {
        subpackets.push(this.parseNextPacket());
      }
      // this.spliceLimit = subPacketsSize;
    } else if (lengthType) {
      const subPacketsCount = binaryToDecimal(
        this.packet.slice(this.cursor, (this.cursor += 11))
      );
      for (let i = 0; i < subPacketsCount; i++) {
        subpackets.push(this.parseNextPacket());
      }
      // this.packetLimit = subPacketsCount;
    }

    return subpackets;
  }

  parseLiteralPacket(packet: number[]): number[] {
    const first = packet[this.cursor];
    const digit = packet.slice(this.cursor, (this.cursor += 4));
    if (first === 0) {
      return digit;
    }

    return [...digit, ...parseLiteralPacket(packet)];
  }

  // resetLimits() {
  //   this.spliceLimit = Infinity;
  //   this.packetLimit = Infinity;
  // }
}

const parseNextPacket = (packet: number[], maxPackets = Infinity): Packet[] => {
  const version = binaryToDecimal(packet.splice(0, 3));
  const type = binaryToDecimal(packet.splice(0, 3));

  let subpackets: any = [];
  let value = undefined;

  if (type === 4) {
    value = binaryToDecimal(parseLiteralPacket(packet));
  } else {
    subpackets = parseOperatorPacket(packet);
  }
  // console.log({ version, type });

  return [
    {
      version,
      type,
      subpackets,
      value,
    },
  ];
};

const parseOperatorPacket = (packet: number[]) => {
  const lengthType = packet.shift();
  // const packetSize = lengthType ? 11 : 15;

  let subpackets: Packet[] = [];

  if (lengthType === 0) {
    const subPacketsSize = binaryToDecimal(packet.splice(0, 15));

    subpackets = parseNextPacket(packet.splice(0, subPacketsSize));
    // packet.reduce();
  } else if (lengthType) {
    const subPacketsCount = binaryToDecimal(packet.slice(0, 11));
  }

  // console.log({ nextPacketSize });
};

const parseLiteralPacket = (packet: number[]): number[] => {
  const first = packet.shift();
  const digit = packet.splice(0, 4);
  if (first === 0) {
    return digit;
  }

  return [...digit, ...parseLiteralPacket(packet)];
};

// parseNextPacket(hexToBinary("38006F45291200".split("")));

const parser = new PacketParser("38006F45291200");
parser.parse();
