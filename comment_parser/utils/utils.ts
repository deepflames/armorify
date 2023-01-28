import { existsSync } from "https://deno.land/std@0.174.0/fs/mod.ts";
import Logger from "https://deno.land/x/logger@v1.0.2/logger.ts";

export interface WriteFileOptions {
  useJson: boolean;
}

export const logger = new Logger();

export async function openFile(path: string) {
  return await Deno.readTextFile(path);
}

export function writeFile(
  path: string,
  fileName: string,
  data: unknown,
  options: WriteFileOptions = { useJson: true },
): void {
  try {
    if (!existsSync(path)) {
      Deno.mkdirSync(path);
    }

    if (options.useJson) {
      Deno.writeTextFileSync(`${path}/${fileName}`, JSON.stringify(data));
    } else {
      Deno.writeFileSync(`${path}/${fileName}`, data as Uint8Array);
    }
  } catch (err: unknown) {
    logger.error((err as Error)["message"]);
  }
}
