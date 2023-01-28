import {existsSync} from "https://deno.land/std@0.174.0/fs/mod.ts";
import {resolve, dirname, fromFileUrl} from "https://deno.land/std@0.174.0/path/mod.ts";
import Logger from "https://deno.land/x/logger@v1.0.2/logger.ts";

export interface WriteFileOptions {
  useJson: boolean;
}

export const logger = new Logger();

export const __dirname = dirname(fromFileUrl(import.meta.url));

console.log(__dirname);

export async function openFile(path: string) {
  return await Deno.readTextFile(resolve(__dirname, path));
}

export function writeFile(
  path: string,
  fileName: string,
  data: unknown,
  options: WriteFileOptions = {useJson: true},
): void {
  try {
    const resolvedPath = resolve(__dirname, path);
    
    if (!existsSync(resolvedPath)) {
      Deno.mkdirSync(resolvedPath);
    }

    if (options.useJson) {
      Deno.writeTextFileSync(`${resolvedPath}/${fileName}`, JSON.stringify(data));
    } else {
      Deno.writeFileSync(`${resolvedPath}/${fileName}`, data as Uint8Array);
    }
  } catch (err: unknown) {
    logger.error((err as Error)["message"]);
  }
}
