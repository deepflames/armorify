// deno-lint-ignore-file no-explicit-any
export interface ParserOptions {
  inputPath: string;
  outputPath: string;
}

export default class BaseParser {
  options: ParserOptions;
  constructor(options: ParserOptions) {
    this.options = options;
  }

  parser(stepFileName: string, stepFileComments: { [index: string]: any }[]) {
    stepFileComments.forEach((stepFileComment, index) => {
      stepFileComment["tags"] =
        (stepFileComment["tags"] as { [index: string]: any }[])?.map((o) => {
          return {
            ...o,
            source: (o["source"] as { [index: string]: any }[])?.map((i) => {
              return {
                tokens: {
                  tag: i["tokens"]["tag"],
                  name: i["tokens"]["name"],
                  description: i["tokens"]["description"],
                  type: i["tokens"]["type"],
                },
              };
            }),
          };
        });

      stepFileComment["source"] =
        (stepFileComment["source"] as { [index: string]: any }[])?.map((o) => {
          return {
            number: o["number"],
            source: o["source"],
            tokens: {
              tag: o["tokens"]["tag"],
              name: o["tokens"]["name"],
              description: o["tokens"]["description"],
              type: o["tokens"]["type"],
            },
          };
        });
      stepFileComments[index] = { ...stepFileComment, fileName: stepFileName };
    });
  }
}
