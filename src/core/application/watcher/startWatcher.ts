import { err, ok, type Result } from "neverthrow";
import { z } from "zod";
import type { FileWatcher } from "@/core/domain/watcher/ports/fileWatcher";
import type { LogParser } from "@/core/domain/watcher/ports/logParser";
import { watcherConfigSchema } from "@/core/domain/watcher/types";
import type { Context } from "../context";
import { processLogFile } from "./processLogFile";

export const startWatcherInputSchema = z.object({
  config: watcherConfigSchema,
});

export type StartWatcherInput = z.infer<typeof startWatcherInputSchema>;

export type StartWatcherError = {
  type: "START_WATCHER_ERROR";
  message: string;
  cause?: unknown;
};

export async function startWatcher(
  context: Context & { fileWatcher: FileWatcher; logParser: LogParser },
  input: StartWatcherInput,
): Promise<Result<void, StartWatcherError>> {
  const parseResult = startWatcherInputSchema.safeParse(input);
  if (!parseResult.success) {
    return err({
      type: "START_WATCHER_ERROR",
      message: "Invalid input",
      cause: parseResult.error,
    });
  }

  try {
    const result = await context.fileWatcher.start(
      input.config,
      async (event) => {
        if (event.type === "add" || event.type === "change") {
          const processResult = await processLogFile(context, {
            filePath: event.filePath,
          });
          if (processResult.isErr()) {
            console.error(
              `Failed to process file ${event.filePath}:`,
              processResult.error,
            );
          }
        }
      },
    );

    if (result.isErr()) {
      return err({
        type: "START_WATCHER_ERROR",
        message: "Failed to start file watcher",
        cause: result.error,
      });
    }

    return ok(undefined);
  } catch (error) {
    return err({
      type: "START_WATCHER_ERROR",
      message: "Failed to start watcher",
      cause: error,
    });
  }
}

export async function stopWatcher(
  context: Context & { fileWatcher: FileWatcher },
): Promise<Result<void, StartWatcherError>> {
  try {
    const result = await context.fileWatcher.stop();
    if (result.isErr()) {
      return err({
        type: "START_WATCHER_ERROR",
        message: "Failed to stop file watcher",
        cause: result.error,
      });
    }

    return ok(undefined);
  } catch (error) {
    return err({
      type: "START_WATCHER_ERROR",
      message: "Failed to stop watcher",
      cause: error,
    });
  }
}
