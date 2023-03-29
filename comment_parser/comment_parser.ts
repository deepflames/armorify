// deno-lint-ignore-file no-explicit-any

import { parse } from "https://deno.land/std@0.174.0/flags/mod.ts";
import { ParserType } from "./models/parserType.ts";
import { DartParser } from "./parser/dart/dart_parser.ts";
import { logger } from "./utils/utils.ts";

const args = parse(Deno.args);
const typeArg = args["type"];
const outputArg = args["output"];
const inputArg = args["input"];
const pubSpecArg = args["pubspec-path"];

main();

function main() {
  let type: ParserType;

  switch (typeArg) {
    case void 0:
    case "dart":
      type = ParserType.dart;

      if (!inputArg || !outputArg || !pubSpecArg) {
        logger.error("All options are required.");
        return;
      }
      break;
    default:
      type = ParserType.unknown;
      break;
  }

  gherkinComments(type).then(() => logger.info('All done.'));
}

async function gherkinComments(this: any, type: ParserType): Promise<void> {
  try {
    switch (type) {
      case ParserType.dart: {
        const parser = new DartParser({
          inputPath: inputArg,
          outputPath: outputArg,
          pubSpecPath: pubSpecArg,
        });
        await parser.execute();
        break;
      }
      default:
        logger.warn(
          `${this.constructor.name}: the type "${typeArg}" is not supported.`,
        );
        return;
    }
  } catch (err) {
    logger.error(`${this.constructor.name}: ${err}`);
  }
}
