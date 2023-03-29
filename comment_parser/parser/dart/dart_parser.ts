import {
  basename,
  globToRegExp,
} from "https://deno.land/std@0.174.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.174.0/fs/walk.ts";
import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts";
import { load } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import { encode } from "https://deno.land/x/msgpack@v1.2/mod.ts";
import { parse } from "https://esm.sh/comment-parser";

import { logger, openFile, writeFile } from "../../utils/utils.ts";
import Template from "../../models/template.ts";
import BaseParser, { ParserOptions } from "../base_parser.ts";
import { predefinedSteps_300_rc9 } from "../../steps/predefined.steps.ts";

export interface DartParserOptions {
  pubSpecPath: string;
}

export class DartParser extends BaseParser {
  override options: ParserOptions & DartParserOptions;

  constructor(options: ParserOptions & DartParserOptions) {
    super(options);
    this.options = options;
  }

  async execute(): Promise<void> {
    try {
      const pubSpecYamlString = await openFile(this.options.pubSpecPath);
      const pubSpecJson = load(pubSpecYamlString);
      const packageName = pubSpecJson["name"];
      const flutterGherkinVersion =
        pubSpecJson["dev_dependencies"]["flutter_gherkin"];

      await this.#parseComments(packageName);

      if (flutterGherkinVersion) {
        this.#parseFlutterGherkinComments(flutterGherkinVersion);
      }
    } catch (err) {
      logger.error(`${this.constructor.name}: ${err}`);
    }
  }

  async #parseComments(packageName: string): Promise<void> {
    const steps = globToRegExp(`/**/*.steps.dart`, {
      extended: true,
      globstar: true,
      caseInsensitive: false,
    });

    const resultFileName = `${packageName}.comments.json`;
    const resultBinFileName = `${packageName}.comments.bin`;
    const body = new Template();
    const result = [];

    for await (
      const stepPath of walk(this.options.inputPath, { match: [steps] })
    ) {
      assert(stepPath.isFile);

      const stepFileName = basename(stepPath.path);
      const stepFile = await openFile(stepPath.path);
      const stepFileComments = parse(stepFile);

      this.parser(stepFileName, stepFileComments);
      result.push(...stepFileComments);

      logger.info(`${this.constructor.name}: parsing ${stepFileName}...`);
    }

    body.appName = packageName;
    body.comments = result;

    const packedFile = encode(body);

    writeFile(this.options.outputPath, resultFileName, body);
    writeFile(this.options.outputPath, resultBinFileName, packedFile, {
      useJson: false,
    });

    logger.info(
      `${this.constructor.name}: all the comments have been saved to the ${resultFileName} / ${resultBinFileName}`,
    );
  }

  #parseFlutterGherkinComments(version: string): void {
    if (version === "3.0.0-rc.9") {
      const packageName = "predefined";
      const resultFileName = `${packageName}.comments.json`;
      const resultBinFileName = `${packageName}.comments.bin`;
      const body = new Template();
      const result = [];
      const stepFileName = packageName;
      const stepFileComments = parse(predefinedSteps_300_rc9);

      this.parser(stepFileName, stepFileComments);
      result.push(...stepFileComments);

      body.appName = packageName;
      body.comments = result;

      const packedFile = encode(body);

      writeFile(this.options.outputPath, resultFileName, body);
      writeFile(this.options.outputPath, resultBinFileName, packedFile, {
        useJson: false,
      });

      logger.info(
        `${this.constructor.name}: all the comments have been saved to the ${resultFileName} / ${resultBinFileName}`,
      );
    }
  }
}
